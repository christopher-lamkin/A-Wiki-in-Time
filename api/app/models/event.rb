class Event < ApplicationRecord
  belongs_to :query
  has_many :queries, through: :queries_events
  has_many :queries_events
end
