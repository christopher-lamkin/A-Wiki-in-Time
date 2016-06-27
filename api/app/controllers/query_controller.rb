class QueryController < ApplicationController

  CATEGORIES_HASH = {
    'battles' => 178561
}

def create
    # p params.inspect
    start_year = params[:date].to_i - params[:year_range].to_i
    end_year = params[:date].to_i + params[:year_range].to_i
    radius = params[:radius].to_i
    lat = params[:lat]
    long = params[:long]
    type = params[:type]

    url = "https://wdq.wmflabs.org/api?q=CLAIM[31:#{CATEGORIES_HASH[type]}]%20and%20between[582,#{start_year},#{end_year}]%20and%20around[625,#{lat},#{long},#{radius}]"
    response = HTTParty.get(url)
    if response['items']
        qIDS = create_qIDS(response['items'])
        qIDString = qIDS.join("%7C")
    end

    if qIDString
        mediaUrl = "https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&ids=#{qIDString}&props=labels%7Cdescriptions%7Cclaims%7Csitelinks%2Furls&languages=en&languag
        efallback=1&sitefilter=&formatversion=2"

        media_response = HTTParty.get(mediaUrl)
    end
    if media_response['entities']
        entities = media_response['entities']
        parsed_response = parse_response(entities)
        parsed_response.unshift({'qids' => qIDS})
        # parsed_response['qids'] => qIDS
        @query = Query.create(user_id: 1, query_url: url, latitude: lat, longitude: long, start_date: start_year, end_date: end_year, radius: radius, event_type: type, notes: '')
        end_point = parsed_response.length - 1
        adjusted_response = parsed_response.to_a[1..end_point]

        adjusted_response.each do |entity|
            entity.each do |qID, value|
                @event = Event.create(qID: qID, title: value[:title], description: value[:description], date: value[:end_time], latitude: value[:latitude], longitude: value[:longitude], event_url: value[:link] )
                QueriesEvent.create(query_id: @query.id, event_id: @event.id )
                p "*" * 20
                p value
            end
        end
        render json: parsed_response

    else
        render json: {error: 'No events found'}
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
end
