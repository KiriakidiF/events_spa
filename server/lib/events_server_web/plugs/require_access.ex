defmodule EventsServerWeb.Plugs.RequireAccess do
  import Plug.Conn

  alias EventsServer.Events

  def init(args), do: args

  def call(conn, _params) do
    #TODO add access to invitees
    user = conn.assigns[:current_user]
    %{"id" => id} = conn.params
    event = Events.get_event!(id)
    IO.inspect(event)
    if event.owner_id == user.id do
      conn
    else
      conn
      |> put_resp_header(
        "content-type", "application/json; charset=UTF-8")
      |> send_resp(
        :unprocessable_entity,
        Jason.encode!(%{"error" => "No owner access to this event."})
      )
      |> halt()
    end
  end
end
