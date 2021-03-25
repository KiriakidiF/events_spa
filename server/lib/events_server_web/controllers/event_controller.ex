defmodule EventsServerWeb.EventController do
  use EventsServerWeb, :controller

  alias EventsServer.Events
  alias EventsServer.Events.Event

  alias EventsServerWeb.Plugs
  plug Plugs.RequireAuth
  plug Plugs.RequireAccess when action not in [:create, :index]

  action_fallback EventsServerWeb.FallbackController

  def index(conn, _params) do
    user = conn.assigns[:current_user]
    IO.inspect(user)
    events = Events.list_events()
    IO.inspect(events)
    events = Enum.filter(events, (fn evt -> evt.owner.id == user.id end))
    render(conn, "index.json", events: events)
  end

  def create(conn, %{"event" => event_params}) do
    with {:ok, %Event{} = event} <- Events.create_event(event_params) do
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

    with {:ok, %Event{}} <- Events.delete_event(event) do
      send_resp(conn, :no_content, "")
    end
  end
end
