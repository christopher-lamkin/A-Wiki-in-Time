class QueryController < ApplicationController

    CATEGORIES_HASH = { 'battles' => 178561, 'archaeological_sites' => 839954, 'sieges' => 188055, 'murders' => 132821, 'earthquakes' => 7944, 'volcanoes' => 7692360, 'tornadoes' => 8081, 'explorers' => 11900058 }

    SELECTOR_HASH = { 'instance of' => 31, 'occupation' => 106}
    LATITUDE_CONVERTER = 110.574
    LONGITUDE_CONVERTER = 111.320
    def create
        p params.inspect

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
        start_year = params[:date].to_i - params[:year_range].to_i
        end_year = params[:date].to_i + params[:year_range].to_i

        # start_year = params[:start_year].to_i
        # end_year = params[:end_year].to_i
        if params[:polygon] == 'true'
            case type
            when 'battles'
                @events = Event.where(scraped_date: start_year..end_year).where.not(latitude: nil).where(event_type: ['battle', 'siege']);
            when 'archaeological_sites'
                @events = Event.where.not(latitude: nil).where(event_type: 'archaeological site');
            when 'explorers'
                @events = Event.where.not(latitude: nil).where(event_type: 'explorer');
            when 'natural_disasters'
                @events = Event.where.not(latitude: nil).where(point_in_time: DateTime.new(start_year)..DateTime.new(end_year)).where(event_type: ['earthquake', 'volcano', 'tornado']);
            when 'assassinations'
                @events = Event.where.not(latitude: nil).where(event_type: 'assassination');
            else
                @events = Event.where.not(latitude: nil);
            end

            if @events
                # @events.each do |event|
                #     @queries_event = QueriesEvent.create(query_id: @query.id, event_id: event.id)
                # end
                response = {events: @events, polygon: true}
            else
                response = {error: "No events found"}
            end
            render json: response
        else

            @query = Query.create(latitude: lat, longitude: long, radius: radius, start_date: start_year, end_date: end_year, event_type: type)

            if type == 'battles'
                @events = Event.where(scraped_date: start_year..end_year).where(latitude: lower_lat..upper_lat).where(longitude: lower_lng..upper_lng).where(event_type: ['battle', 'siege'])
            elsif type == 'archaeological_sites'
                @events = Event.where(latitude: lower_lat..upper_lat).where(longitude: lower_lng..upper_lng).where(event_type: 'archaeological site')
            elsif type == 'assassinations'
                @events = Event.where(latitude: lower_lat..upper_lat).where(longitude: lower_lng..upper_lng).where(event_type: 'assassination')
            elsif type == 'natural_disasters'
                @events = Event.where(point_in_time: DateTime.new(start_year)..DateTime.new(end_year)).where(latitude: lower_lat..upper_lat).where(longitude: lower_lng..upper_lng).where(event_type: ['earthquake', 'volcano', 'tornado'])
            elsif type == 'explorers'
                @events = Event.where(latitude: lower_lat..upper_lat).where(longitude: lower_lng..upper_lng).where(event_type: 'explorer')
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
