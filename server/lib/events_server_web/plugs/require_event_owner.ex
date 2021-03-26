defmodule EventsServerWeb.Plugs.RequireEventOwner do
  import Plug.Conn

  alias EventsServer.Events

  def init(args), do: args

  @spec call(
          atom
          | %{:assigns => nil | maybe_improper_list | map, :params => map, optional(any) => any},
          any
        ) ::
          atom
          | %{:assigns => nil | maybe_improper_list | map, :params => map, optional(any) => any}
  def call(conn, _params) do
    user = conn.assigns[:current_user]
    event_id = conn.assigns[:event_id]
    event = Events.get_event!(event_id)
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
