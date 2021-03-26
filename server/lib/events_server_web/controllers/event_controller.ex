defmodule EventsServerWeb.EventController do
  use EventsServerWeb, :controller

  alias EventsServer.Events
  alias EventsServer.Events.Event
  alias EventsServer.Comments
  alias EventsServer.Invites

  alias EventsServerWeb.Plugs
  plug Plugs.RequireAuth
  plug Plugs.RequireAccess when action not in [:create, :index]
  plug Plugs.RequireOwner when action in [:update, :delete]

  action_fallback EventsServerWeb.FallbackController

  def index(conn, _params) do
    user = conn.assigns[:current_user]
    IO.inspect(user)
    events = Events.list_events()
    IO.inspect(events)
    events = Enum.filter(events, (fn evt ->
      evt.owner.id == user.id
      || Enum.any?(evt.invites, (fn inv -> inv.user_email == user.email end))
    end));
    render(conn, "index.json", events: events)
  end

  def create(conn, %{"event" => event_params}) do
    IO.inspect(event_params)
    event_params = event_params
    |> Map.put("owner_id", conn.assigns[:current_user].id)
    create = Events.create_event(event_params)
    IO.inspect(create)
    with {:ok, %Event{} = event} <- create do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.event_path(conn, :show, event))
      |> render("show.json", event: event)
    end
  end

  def show(conn, %{"id" => id}) do
    event = Events.get_event!(id)
    render(conn, "show.json", event: event)
  end

  def update(conn, %{"id" => id, "event" => event_params}) do
    event = Events.get_event!(id)

    with {:ok, %Event{} = event} <- Events.update_event(event, event_params) do
      render(conn, "show.json", event: event)
    end
  end

  def delete(conn, %{"id" => id}) do
    event = Events.get_event!(id)
    for comment <- event.comments do
      Comments.delete_comment(comment)
    end
    for invite <- event.invites do
      Invites.delete_invite(invite)
    end

    with {:ok, %Event{}} <- Events.delete_event(event) do
      send_resp(conn, :no_content, "")
    end
  end
end
