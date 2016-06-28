# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
# User.delete_all
# Query.delete_all
# Event.delete_all
# QueriesEvent.delete_all


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
  p battles_data_url = 'https://wdq.wmflabs.org/api?q=CLAIM[31:178561]'
  p response = HTTParty.get(battles_data_url)
  dates = []
  date_strings = []
  p qIDS = create_qIDS(response['items'])


  qIDS = qIDS[0..200]
  qIDS.each_slice(200) do |qid_array|
    p qIDString = qid_array.join("%7C")
    p battles_media_url = "https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&ids=#{qIDString}&props=labels%7Cdescriptions%7Cclaims%7Csitelinks%2Furls&languages=en&languag
    efallback=1&sitefilter=&formatversion=2"
    p media_response = HTTParty.get(battles_media_url)
    p entities = media_response['entities']
    p parsed_response = parse_response(entities)
    parsed_response.each do |entity_hash|
      entity_hash.each do |qID, value|
        @event = Event.new(qID: qID, title: value[:title], description: value[:description], end_time: value[:end_time], latitude: value[:latitude], longitude: value[:longitude], event_url: value[:link], point_in_time: value[:point_in_time] )
        battle_url = value[:link]
        begin
          page = mechanize.get(battle_url)
          p '%'*100
          date_box = page.at('.infobox table td')
          break if date_box.nil?
          p date = date_box.text.strip
          date_strings << date
          parsed_date_array_array = date.scan(/(\d{1,4}\sAD|\d{1,4}\sBC)/)
          unless parsed_date_array_array.empty?
            parsed_date_array = parsed_date_array_array.last
          end
          if parsed_date_array
            parsed_date = parsed_date_array.first
          else
            parsed_date = nil
          end
          puts "PARSED   #{parsed_date}"
          puts parsed_date.class
          # p parsed_date = parsed_date || ''
          p '%'*100

          if parsed_date.nil?
            p '*'*100
            p date
            p parsed_date = date.scan(/\d{3,4}/).last
            p parsed_date = parsed_date.to_i
            dates << parsed_date
            @event.scraped_date = parsed_date
            @event.save
            p '*'*100
          else
            if parsed_date[-2..-1] == 'BC'
              parsed_date = (parsed_date[0...-3].to_i)*-1
              dates << parsed_date
            else
              parsed_date = parsed_date[0...-3]
              dates << parsed_date
            end
            @event.scraped_date = parsed_date
            @event.save
          end
        rescue Mechanize::ResponseCodeError
          break
        end
      end
    end
  end

  p dates
  p dates.length
  p date_strings
  p date_strings.length

