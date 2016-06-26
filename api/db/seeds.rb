# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
User.delete_all
Query.delete_all
Event.delete_all
QueriesEvent.delete_all


User.create(
  username: "tim", email: "tim@tim.com", password: "1234"
)


Query.create(
  user_id: 1, query_url: Faker::Internet.url, latitude: 34.475854558497, longitude: -83.7331578750001, radius: 300, start_date: 1845, end_date: 1885, event_type: "battles", notes: ""
)

Query.create(
  user_id: 1, query_url: Faker::Internet.url, latitude: 52.0701159653907, longitude: -0.412845374999961, radius: 300, start_date: 930, end_date: 1130, event_type: "battles", notes: ""
)

Query.create(
  user_id: 1, query_url: Faker::Internet.url, latitude: 35.627024086052, longitude: 9.47484993749993, radius: 300, start_date: 431, end_date: 631, event_type: "battles", notes: ""
  )
