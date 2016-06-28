class QueryController < ApplicationController

    CATEGORIES_HASH = { 'battles' => 178561, 'archaeological_sites' => 839954, 'sieges' => 188055 }
    LATITUDE_CONVERTER = 110.574
    LONGITUDE_CONVERTER = 111.320
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

        if type == 'battles'
            @events = Event.where(scraped_date: start_year..end_year).where(latitude: lower_lat..upper_lat).where(longitude: lower_lng..upper_lng).where(event_type: 'battle')
        elsif type == 'archaeological_sites'
            @events = Event.where(latitude: lower_lat..upper_lat).where(longitude: lower_lng..upper_lng).where(event_type: 'archaeological site')
        else
          @events = Event.where(latitude: lower_lat..upper_lat).where(longitude: lower_lng..upper_lng)
      end
      if @events
        @events.each do |event|
            @queries_event = QueriesEvent.create(query_id: @query.id, event_id: event.id)
        end
        response = {events: @events}
    else
        response = {error: "No events found"}
    end
    render json: response

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

