# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     EventsServer.Repo.insert!(%EventsServer.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias EventsServer.Repo
alias EventsServer.Users.User

ted = Repo.insert!(%User{name: "ted", password_hash: "", email: "ted@gmail"})
tod = Repo.insert!(%User{name: "tod", password_hash: "", email: "tod@yahoo"})
