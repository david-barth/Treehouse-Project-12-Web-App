class User < ApplicationRecord
    has_many :notifications
    belongs_to :notification 
end
