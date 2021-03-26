defmodule EventsServerWeb.Plugs.RequireEventId do
  import Plug.Conn

  def init(args), do: args

  def call(conn, _params) do
    case conn.params do
      %{"event_id" => event_id} ->
        conn
        |> assign(:event_id, String.to_integer(event_id))
      _ ->
        conn
        |> put_resp_header(
          "content-type", "application/json; charset=UTF-8")
        |> send_resp(
          :unprocessable_entity,
          Jason.encode!(%{"error" => "Must specify an event to access invites"})
        )
        |> halt()
    end
  end
end
