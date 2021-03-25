defmodule EventsServerWeb.Plugs.RequireAccess do
  import Plug.Conn

  alias EventsServer.Events

  def init(args), do: args

  def call(conn, %{"id" => id}) do
    user = conn.assigns[:current_users]
    IO.inspect(user)
    event = Events.get_event!(id)

    if event.owner.id == user.id do
      conn
    else
      conn
      |> put_resp_header(
        "content-type", "application/json; charset=UTF-8")
      |> send_resp(
        :unprocessable_entity,
        Jason.encode!(%{"error" => "No access to this event."})
      )
      |> halt()
    end
  end
end
