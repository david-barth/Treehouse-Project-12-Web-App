# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)


Notification.create(title: 'Hello all', description: 'Well, this is fun', date: DateTime.now, user_id: 123456)
Notification.create(title: 'Be the most powerful', description: 'Look, It is hard being cool', date: DateTime.now, user_id: 335334)
Notification.create(title: 'Cute', description: 'I am so cuter than cute', date: DateTime.now, user_id: 474928)

notifications = Notification.all.ids

User.create(name: 'David Barth', isAdmin: false, notifications: notifications)