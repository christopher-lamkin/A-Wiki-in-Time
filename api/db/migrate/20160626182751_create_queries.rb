class CreateQueries < ActiveRecord::Migration[5.0]
  def change
    create_table :queries do |t|

      t.integer :user_id
      t.string :query_url
      t.float :latitude
      t.float :longitude
      t.integer :radius
      t.integer :start_date
      t.integer :end_date
      t.string :event_type
      t.text :notes

      t.timestamps
    end
  end
end
