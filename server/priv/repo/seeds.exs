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
alias EventsServer.Events.Event
alias EventsServer.Invites.Invite
alias EventsServer.Comments.Comment

defmodule Inject do
  def user(name, pass, email) do
    hash = Argon2.hash_pwd_salt(pass)
    Repo.insert!(%User{name: name, password_hash: hash, email: email})
  end

  def event(name, date, desc, owner) do
    Repo.insert!(%Event{name: name, date: date, desc: desc, owner_id: owner})
  end

  def invite(response, user_email, event_id) do
    Repo.insert!(%Invite{response: response, user_email: user_email, event_id: event_id})
  end

  def comment(body, event_id, user_id) do
    Repo.insert!(%Comment{body: body, event_id: event_id, user_id: user_id})
  end
end

ted = Inject.user("ted", "tedtedted", "ted@gmail")
tod = Inject.user("tod", "todtodtod", "tod@yahoo")

tedBday = Inject.event("Ted's Birthday",
  ~U[2021-03-25 14:11:50Z],
  "Its gonna be great.",
  ted.id
)

todInvite = Inject.invite("", tod.email, tedBday.id)

todComment = Inject.comment("What will we do?", tedBday.id, tod.id)
