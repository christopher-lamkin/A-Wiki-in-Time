class Query < ApplicationRecord
  belongs_to :user
  belongs_to :event
  has_many :events, through: :queries_events
  has_many :queries_events
end
