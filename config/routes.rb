Rails.application.routes.draw do
  devise_for :users
  root 'groups#index'
  resources :users, only: %i[index edit update destroy]
  resources :groups, only: %i[new create edit update destroy] do
    resources :messages, only: %i[index create]
    namespace :api do
      resources :messages, only: [:index]
    end
    collection do
      put 'show_last_message'
    end
    member do
      get 'remove_user'
    end
  end
end
