class QueryController < ApplicationController

    CATEGORIES_HASH = { 'battles' => 178561, 'archaeological_sites' => 839954 }
    LATITUDE_CONVERTER = 110.574
    LONGITUDE_CONVERTER = 111
    def create
        p params.inspect

        # start_year = params[:start_year].to_i
        # end_year = params[:end_year].to_i

        start_year = params[:date].to_i - params[:year_range].to_i
        end_year = params[:date].to_i + params[:year_range].to_i


        radius = params[:radius].to_i
        lat = params[:lat].to_f
        long = params[:long].to_f
        type = params[:type]
        radians = lat/180*Math::PI
        lat_shift = radius/LATITUDE_CONVERTER
        long_shift = radius/(LONGITUDE_CONVERTER*Math.cos(radians))
        lower_lat = lat - lat_shift
        upper_lat = lat + lat_shift
        lower_lng = long - long_shift
        upper_lng = long + long_shift

        @query = Query.create(latitude: lat, longitude: long, radius: radius, start_date: start_year, end_date: end_year, event_type: type)
        @events = Event.where(scraped_date: start_year..end_year).where(latitude: lower_lat..upper_lat).where(longitude: lower_lng..upper_lng)
        if @events
            @events.each do |event|
                @queries_event = QueriesEvent.create(query_id: @query.id, event_id: event.id)
            end
            response = {events: @events}
        else
            response = {error: "No events found"}
        end
        render json: response



    # if type == 'battles'
    #     url = "https://wdq.wmflabs.org/api?q=CLAIM[31:#{CATEGORIES_HASH[type]}]%20and%20between[582,#{start_year},#{end_year}]%20and%20around[625,#{lat},#{long},#{radius}]"
    # else
    #     url = "https://wdq.wmflabs.org/api?q=CLAIM[31:#{CATEGORIES_HASH[type]}]%20and%20around[625,#{lat},#{long},#{radius}]"
    # end
    # response = HTTParty.get(url)
    # qIDS = create_qIDS(response['items'])
    # qIDString = qIDS.join("%7C")

    # mediaUrl = "https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&ids=#{qIDString}&props=labels%7Cdescriptions%7Cclaims%7Csitelinks%2Furls&languages=en&languag
    # efallback=1&sitefilter=&formatversion=2"

    # media_response = HTTParty.get(mediaUrl)

    # if media_response['entities']
    #     entities = media_response['entities']
    #     if type == 'battles'
    #         parsed_response = parse_response(entities)
    #     else
    #         parsed_response = parse_archaeological_response(entities)
    #     end
    #     parsed_response.unshift({'qids' => qIDS, 'type' => type})
    #         # parsed_response['qids'] => qIDS
    #         @query = Query.create(user_id: 1, query_url: url, latitude: lat, longitude: long, start_date: start_year, end_date: end_year, radius: radius, event_type: type, notes: '')

    #         end_point = parsed_response.length - 1
    #         adjusted_response = parsed_response.to_a[1..end_point]

    #         adjusted_response.each do |entity|
    #             entity.each do |qID, value|
    #                 @event = Event.create(qID: qID, title: value[:title], description: value[:description], end_time: value[:end_time], latitude: value[:latitude], longitude: value[:longitude], event_url: value[:link] )
    #                 QueriesEvent.create(query_id: @query.id, event_id: @event.id )
    #                 p "*" * 20
    #                 p value
    #             end
    #         end
    #         render json: parsed_response

    #     else
    #         render json: {error: 'No events found'}
    #     end
end

private

def create_qIDS(id_array)
    id_array.map{|id| 'Q'+id.to_s}
end

def parse_response(entities)
    parsed_response = entities.map do |entity, value|
        {entity => {
            title: value.fetch('labels', {}).fetch('en', {}).fetch('value', "[No title found]"),
            description: value.fetch('descriptions', {}).fetch('en', {}).fetch('value', "[No description found]"),
            latitude: value['claims']['P625'][0]['mainsnak']['datavalue']['value']['latitude'],
            longitude: value['claims']['P625'][0]['mainsnak']['datavalue']['value']['longitude'],
            end_time: value['claims']['P582'][0]['mainsnak']['datavalue']['value']['time'],
            link: value.fetch('sitelinks', {}).fetch('enwiki', {}).fetch('url', "[No URL found]")
            }}
        end
        parsed_response
    end

    def parse_archaeological_response(entities)
        parsed_response = entities.map do |entity, value|
            {entity => {
                title: value.fetch('labels', {}).fetch('en', {}).fetch('value', "[No title found]"),
                description: value.fetch('descriptions', {}).fetch('en', {}).fetch('value', "[No description found]"),
                latitude: value['claims']['P625'][0]['mainsnak']['datavalue']['value']['latitude'],
                longitude: value['claims']['P625'][0]['mainsnak']['datavalue']['value']['longitude'],
                link: value.fetch('sitelinks', {}).fetch('enwiki', {}).fetch('url', "[No URL found]")
                }}
            end
            parsed_response
        end
    end

