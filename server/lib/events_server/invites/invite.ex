defmodule EventsServer.Invites.Invite do
  use Ecto.Schema
  import Ecto.Changeset

  schema "invites" do
    field :response, :string
    field :user_email, :string
    belongs_to :event, EventsServer.Events.Event

    timestamps()
  end

  @doc false
  def changeset(invite, attrs) do
    invite
    |> cast(attrs, [:response, :user_email, :event_id])
    |> validate_required([:user_email, :event_id])
    |> validate_format(:user_email, ~r/@/)
  end
end
