require 'mechanize'
require 'httparty'

# User.delete_all
# Query.delete_all
# Event.delete_all
# QueriesEvent.delete_all
# Event.where(event_type: 'assassination').destroy_all
# Event.where(event_type: 'explorer').destroy_all

dates = []
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
      death_date: value.fetch('claims', {}).fetch('P570', [{}]).fetch(0).fetch('mainsnak', {}).fetch('datavalue', {}).fetch('value', {}).fetch('time', nil),
      point_in_time: value.fetch('claims', {}).fetch('P585', [{}]).fetch(0).fetch('mainsnak', {}).fetch('datavalue', {}).fetch('value', {}).fetch('time', nil),
      link: value.fetch('sitelinks', {}).fetch('enwiki', {}).fetch('url', "[No URL found]")
      }}
    end
    parsed_response
  end

  mechanize = Mechanize.new



 # # QUERY SEEDS FOR EXPLORERS
 explorers_data_url = 'https://wdq.wmflabs.org/api?q=CLAIM[106:11900058]'
 explorer_response = HTTParty.get(explorers_data_url)
 explorer_qIDS = create_qIDS(explorer_response['items'])

 explorer_qIDS.each_slice(50) do |qid_array|
  qIDString = qid_array.join("%7C")
  explorer_media_url = "https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&ids=#{qIDString}&props=labels%7Cdescriptions%7Cclaims%7Csitelinks%2Furls&languages=en&languag
  efallback=1&sitefilter=&formatversion=2"
  media_response = HTTParty.get(explorer_media_url)
  entities = media_response['entities']
  p parsed_response = parse_response(entities)
  parsed_response.each do |entity_hash|
    entity_hash.each do |qID, value|
      @event = Event.new(qID: qID, title: value[:title], end_time: value[:death_date], latitude: value[:latitude], longitude: value[:longitude], event_url: value[:link], point_in_time: value[:point_in_time], event_type: 'explorer' )
      explorer_url = value[:link]
      begin
        page = mechanize.get(explorer_url)
        description = ''
        if page.at('#mw-content-text')
          if page.at('#mw-content-text').xpath('./p')
            if page.at('#mw-content-text').xpath('./p').first
              description = page.at('#mw-content-text').xpath('./p').first.text
            end
          end
        end

        death_place = ''

        if page.at('th:contains("Died")')
          if page.at('th:contains("Died")').parent
            if page.at('th:contains("Died")').parent.at('a')
              death_place = page.at('th:contains("Died")').parent.at('a').text.strip
            end
          end
        end

        if death_place != ''
          location_lat_lng = Geocoder.coordinates(death_place)
          if @event.latitude.nil?
            if location_lat_lng
              @event.latitude = location_lat_lng[0]
              @event.longitude = location_lat_lng[1]
            end
          end
        end

        @event.description = description
        @event.save
      rescue Mechanize::ResponseCodeError
        break
      end
    end
  end
end


  # # QUERY SEEDS FOR VOLCANOES
  volcanoes_data_url = 'https://wdq.wmflabs.org/api?q=CLAIM[31:7692360]'
  volcano_response = HTTParty.get(volcanoes_data_url)
  volcano_qIDS = create_qIDS(volcano_response['items'])

  volcano_qIDS.each_slice(50) do |qid_array|
    qIDString = qid_array.join("%7C")
    volcano_media_url = "https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&ids=#{qIDString}&props=labels%7Cdescriptions%7Cclaims%7Csitelinks%2Furls&languages=en&languag
    efallback=1&sitefilter=&formatversion=2"
    media_response = HTTParty.get(volcano_media_url)
    entities = media_response['entities']
    p parsed_response = parse_response(entities)
    parsed_response.each do |entity_hash|
      entity_hash.each do |qID, value|
        @event = Event.new(qID: qID, title: value[:title], end_time: value[:end_time], latitude: value[:latitude], longitude: value[:longitude], event_url: value[:link], point_in_time: value[:point_in_time], event_type: 'volcano' )
        volcano_url = value[:link]
        begin
          page = mechanize.get(volcano_url)
          description = ''
          if page.at('#mw-content-text')
            if page.at('#mw-content-text').xpath('./p')
              if page.at('#mw-content-text').xpath('./p').first
                description = page.at('#mw-content-text').xpath('./p').first.text
              end
            end
          end
          @event.description = description
          @event.save
        rescue Mechanize::ResponseCodeError
          break
        end
      end
    end
  end


  # # QUERY SEEDS FOR EARTHQUAKES
  earthquakes_data_url = 'https://wdq.wmflabs.org/api?q=CLAIM[31:7944]'
  earthquake_response = HTTParty.get(earthquakes_data_url)
  earthquake_qIDS = create_qIDS(earthquake_response['items'])

  earthquake_qIDS.each_slice(50) do |qid_array|
    qIDString = qid_array.join("%7C")
    earthquake_media_url = "https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&ids=#{qIDString}&props=labels%7Cdescriptions%7Cclaims%7Csitelinks%2Furls&languages=en&languag
    efallback=1&sitefilter=&formatversion=2"
    media_response = HTTParty.get(earthquake_media_url)
    entities = media_response['entities']
    p parsed_response = parse_response(entities)
    parsed_response.each do |entity_hash|
      entity_hash.each do |qID, value|
        @event = Event.new(qID: qID, title: value[:title], end_time: value[:end_time], latitude: value[:latitude], longitude: value[:longitude], event_url: value[:link], point_in_time: value[:point_in_time], event_type: 'earthquake' )
        earthquake_url = value[:link]
        begin
          page = mechanize.get(earthquake_url)
          description = ''
          if page.at('#mw-content-text')
            if page.at('#mw-content-text').xpath('./p')
              if page.at('#mw-content-text').xpath('./p').first
                description = page.at('#mw-content-text').xpath('./p').first.text
              end
            end
          end
          @event.description = description
          @event.save
        rescue Mechanize::ResponseCodeError
          break
        end
      end
    end
  end

  # # QUERY SEEDS FOR MURDERS/ASSASSINATIONS
  murders_data_url = 'https://wdq.wmflabs.org/api?q=CLAIM[31:132821]'
  murder_response = HTTParty.get(murders_data_url)
  murder_qIDS = create_qIDS(murder_response['items'])

  murder_qIDS.each_slice(50) do |qid_array|
    qIDString = qid_array.join("%7C")
    murder_media_url = "https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&ids=#{qIDString}&props=labels%7Cdescriptions%7Cclaims%7Csitelinks%2Furls&languages=en&languag
    efallback=1&sitefilter=&formatversion=2"
    media_response = HTTParty.get(murder_media_url)
    entities = media_response['entities']
    p parsed_response = parse_response(entities)
    parsed_response.each do |entity_hash|
      entity_hash.each do |qID, value|
        @event = Event.new(qID: qID, title: value[:title], end_time: value[:end_time], latitude: value[:latitude], longitude: value[:longitude], event_url: value[:link], point_in_time: value[:point_in_time], event_type: 'assassination' )
        murder_url = value[:link]
        begin
          page = mechanize.get(murder_url)
          description = ''
          location = ''
          if page.at('#mw-content-text')
            if page.at('#mw-content-text').xpath('./p')
              if page.at('#mw-content-text').xpath('./p').first
                description = page.at('#mw-content-text').xpath('./p').first.text
              end
            end
          end

          if page.at('#mw-content-text p a')
            location = page.at('#mw-content-text p a').text.strip
          end

          if location != ''
            location_lat_lng = Geocoder.coordinates(location)
            if @event.latitude.nil?
              if location_lat_lng
                @event.latitude = location_lat_lng[0]
                @event.longitude = location_lat_lng[1]
              end
            end
          end
          @event.description = description
          @event.save
        rescue Mechanize::ResponseCodeError
          break
        end
      end
    end
  end


# # QUERY SEEDS FOR SIEGES

sieges_data_url = 'https://wdq.wmflabs.org/api?q=CLAIM[31:188055]'
siege_response = HTTParty.get(sieges_data_url)
siege_qIDS = create_qIDS(siege_response['items'])

siege_qIDS.each_slice(50) do |qid_array|
  qIDString = qid_array.join("%7C")
  sieges_media_url = "https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&ids=#{qIDString}&props=labels%7Cdescriptions%7Cclaims%7Csitelinks%2Furls&languages=en&languag
  efallback=1&sitefilter=&formatversion=2"
  media_response = HTTParty.get(sieges_media_url)
  entities = media_response['entities']
  p parsed_response = parse_response(entities)
  parsed_response.each do |entity_hash|
    entity_hash.each do |qID, value|
      @event = Event.new(qID: qID, title: value[:title], end_time: value[:end_time], latitude: value[:latitude], longitude: value[:longitude], event_url: value[:link], point_in_time: value[:point_in_time], event_type: 'siege' )
      siege_url = value[:link]
      begin
        page = mechanize.get(siege_url)
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
          parsed_date = date.scan(/\d{3,4}/).last
          parsed_date = parsed_date.to_i
          @event.scraped_date = parsed_date
          description = ''
          if page.at('#mw-content-text')
            if page.at('#mw-content-text').xpath('./p')
              if page.at('#mw-content-text').xpath('./p').first
                description = page.at('#mw-content-text').xpath('./p').first.text
              end
            end
          end
          @event.description = description
          @event.save
        else
          if parsed_date[-2..-1] == 'BC'
            parsed_date = (parsed_date[0...-3].to_i)*-1
          else
            parsed_date = parsed_date[0...-3]
          end
          @event.scraped_date = parsed_date
          description = ''
          if page.at('#mw-content-text')
            if page.at('#mw-content-text').xpath('./p')
              if page.at('#mw-content-text').xpath('./p').first
                description = page.at('#mw-content-text').xpath('./p').first.text
              end
            end
          end
          @event.description = description
          @event.save
        end
      rescue Mechanize::ResponseCodeError
        break
      end
    end
  end
end


# # QUERY SEEDS FOR ARCHAEOLOGICAL SITES

  archaeological_sites_data_url = 'https://wdq.wmflabs.org/api?q=CLAIM[31:839954]'
  archaeological_response = HTTParty.get(archaeological_sites_data_url)
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
          description = ''
          if page.at('#mw-content-text')
            if page.at('#mw-content-text').xpath('./p')
              if page.at('#mw-content-text').xpath('./p').first
                description = page.at('#mw-content-text').xpath('./p').first.text
              end
            end
          end

          # date_box = page.at('.infobox table td')

          @event.description = description
          @event.save

        rescue Mechanize::ResponseCodeError
          break
        end
      end
    end
  end



# QUERY SEEDS FOR BATTLES

  battles_data_url = 'https://wdq.wmflabs.org/api?q=CLAIM[31:178561]'
  battle_response = HTTParty.get(battles_data_url)
  qIDS = create_qIDS(battle_response['items'])

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
            description = ''
            if page.at('#mw-content-text')
              if page.at('#mw-content-text').xpath('./p')
                if page.at('#mw-content-text').xpath('./p').first
                  description = page.at('#mw-content-text').xpath('./p').first.text
                end
              end
            end
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
            description = ''
            if page.at('#mw-content-text')
              if page.at('#mw-content-text').xpath('./p')
                if page.at('#mw-content-text').xpath('./p').first
                  description = page.at('#mw-content-text').xpath('./p').first.text
                end
              end
            end
            @event.description = description
            @event.save
          end
        rescue Mechanize::ResponseCodeError
          break
        end
      end
    end
  end
