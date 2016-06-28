class CreateQueriesEvents < ActiveRecord::Migration[5.0]
  def change
    create_table :queries_events do |t|

      t.integer :query_id
      t.integer :event_id
      t.boolean :is_starred
      t.timestamps
    end
  end
end
