class QueriesEvent < ApplicationRecord
  belongs_to :query
  belongs_to :event
end
