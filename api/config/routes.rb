Rails.application.routes.draw do
  post 'query', to: 'query#create'
end
