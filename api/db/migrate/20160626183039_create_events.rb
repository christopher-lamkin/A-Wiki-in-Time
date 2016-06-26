class CreateEvents < ActiveRecord::Migration[5.0]
  def change
    create_table :events do |t|

      t.string :qID
      t.string :title
      t.text :description
      t.datetime :date
      t.float :latitude
      t.float :longitude
      t.string :event_url

      t.timestamps
    end
  end
end
