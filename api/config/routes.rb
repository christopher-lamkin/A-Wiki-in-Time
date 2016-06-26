Rails.application.routes.draw do
  # devise_for :users
  post 'query', to: 'query#create'
  post 'auth_user' => 'authentication#authenticate_user'
  get 'home' => 'home#index'
end
