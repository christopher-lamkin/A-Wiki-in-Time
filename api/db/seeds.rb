# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)


# User.create(
#   username: "tim", email: "tim@tim.com", password: "1234"
# )


# Query.create(
#   user_id: 1, query_url: Faker::Internet.url, latitude: 34.475854558497, longitude: -83.7331578750001, radius: 300, start_date: 1845, end_date: 1885, event_type: "battles", notes: ""
# )

# Query.create(
#   user_id: 1, query_url: Faker::Internet.url, latitude: 52.0701159653907, longitude: -0.412845374999961, radius: 300, start_date: 930, end_date: 1130, event_type: "battles", notes: ""
# )

# Query.create(
#   user_id: 1, query_url: Faker::Internet.url, latitude: 35.627024086052, longitude: 9.47484993749993, radius: 300, start_date: 431, end_date: 631, event_type: "battles", notes: ""
#   )

require 'mechanize'
require 'httparty'

User.delete_all
Query.delete_all
Event.delete_all
QueriesEvent.delete_all

def create_qIDS(id_array)
  id_array.map{|id| 'Q'+id.to_s}
end

def parse_response(entities)
  parsed_response = entities.map do |entity, value|
    {entity => {
      title: value.fetch('labels', {}).fetch('en', {}).fetch('value', "[No title found]"),
      description: value.fetch('descriptions', {}).fetch('en', {}).fetch('value', "[No description found]"),
      latitude: value.fetch('claims', {}).fetch('P625', [{}]).fetch(0).fetch('mainsnak', {}).fetch('datavalue', {}).fetch('value', {}).fetch('latitude', nil),
      longitude: value.fetch('claims', {}).fetch('P625', [{}]).fetch(0).fetch('mainsnak', {}).fetch('datavalue', {}).fetch('value', {}).fetch('longitude', nil),
      end_time: value.fetch('claims', {}).fetch('P582', [{}]).fetch(0).fetch('mainsnak', {}).fetch('datavalue', {}).fetch('value', {}).fetch('time', nil),
      point_in_time: value.fetch('claims', {}).fetch('P585', [{}]).fetch(0).fetch('mainsnak', {}).fetch('datavalue', {}).fetch('value', {}).fetch('time', nil),
      link: value.fetch('sitelinks', {}).fetch('enwiki', {}).fetch('url', "[No URL found]")
      }}
    end
    parsed_response
  end

  mechanize = Mechanize.new

  archaeological_sites_data_url = 'https://wdq.wmflabs.org/api?q=CLAIM[31:839954]'
  battles_data_url = 'https://wdq.wmflabs.org/api?q=CLAIM[31:178561]'
  archaeological_response = HTTParty.get(archaeological_sites_data_url)
  dates = []


  response = HTTParty.get(battles_data_url)
  qIDS = create_qIDS(response['items'])
  arch_qIDS = create_qIDS(archaeological_response['items'])

  # arch_qIDS = arch_qIDS[0..200]

  arch_qIDS.each_slice(50) do |qid_array|
    qIDString = qid_array.join("%7C")
    arch_media_url = "https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&ids=#{qIDString}&props=labels%7Cdescriptions%7Cclaims%7Csitelinks%2Furls&languages=en&languag
    efallback=1&sitefilter=&formatversion=2"
    media_response = HTTParty.get(arch_media_url)
    entities = media_response['entities']
    p parsed_response = parse_response(entities)
    parsed_response.each do |entity_hash|
      entity_hash.each do |qID, value|
        @event = Event.new(qID: qID, title: value[:title], end_time: value[:end_time], latitude: value[:latitude], longitude: value[:longitude], event_url: value[:link], point_in_time: value[:point_in_time], event_type: 'archaeological site' )
        arch_url = value[:link]
        begin
          page = mechanize.get(arch_url)
          description = page.at('#mw-content-text').xpath('./p').first.text
          # date_box = page.at('.infobox table td')

          @event.description = description
          @event.save

        rescue Mechanize::ResponseCodeError
          break
        end
      end
    end
  end
  qIDS.each_slice(50) do |qid_array|
    qIDString = qid_array.join("%7C")
    battles_media_url = "https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&ids=#{qIDString}&props=labels%7Cdescriptions%7Cclaims%7Csitelinks%2Furls&languages=en&languag
    efallback=1&sitefilter=&formatversion=2"
    media_response = HTTParty.get(battles_media_url)
    entities = media_response['entities']
    p parsed_response = parse_response(entities)
    parsed_response.each do |entity_hash|
      entity_hash.each do |qID, value|
        @event = Event.new(qID: qID, title: value[:title], end_time: value[:end_time], latitude: value[:latitude], longitude: value[:longitude], event_url: value[:link], point_in_time: value[:point_in_time], event_type: 'battle' )
        battle_url = value[:link]
        begin
          page = mechanize.get(battle_url)
          description = page.at('#mw-content-text').xpath('./p').first.text
          date_box = page.at('.infobox table td')
          break if date_box.nil?
          date = date_box.text.strip

          parsed_date_array_array = date.scan(/(\d{1,4}\sAD|\d{1,4}\sBC)/)
          unless parsed_date_array_array.empty?
            parsed_date_array = parsed_date_array_array.last
          end
          if parsed_date_array
            parsed_date = parsed_date_array.first
          else
            parsed_date = nil
          end

          if parsed_date.nil?
            date
            parsed_date = date.scan(/\d{3,4}/).last
            parsed_date = parsed_date.to_i
            dates << parsed_date
            @event.scraped_date = parsed_date
            @event.description = description
            @event.save
          else
            if parsed_date[-2..-1] == 'BC'
              parsed_date = (parsed_date[0...-3].to_i)*-1
              dates << parsed_date
            else
              parsed_date = parsed_date[0...-3]
              dates << parsed_date
            end
            @event.scraped_date = parsed_date
            @event.description = description
            @event.save
          end
        rescue Mechanize::ResponseCodeError
          break
        end
      end
    end
  end


