defmodule EventsServer.Users.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :email, :string
    field :name, :string
    field :password_hash, :string
    field :profile_hash, :string

    has_many :events, EventsServer.Events.Event, foreign_key: :owner_id
    has_many :comments, EventsServer.Comments.Comment

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:name, :email, :password_hash, :profile_hash])
    |> validate_required([:name, :email, :password_hash])
    |> validate_format(:email, ~r/@/)
    |> unique_constraint(:email)
  end
end
