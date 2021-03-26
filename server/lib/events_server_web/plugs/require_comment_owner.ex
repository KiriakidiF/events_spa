defmodule EventsServerWeb.Plugs.RequireCommentOwner do
  import Plug.Conn

  alias EventsServer.Comments
  alias EventsServer.Events

  def init(args), do: args

  def call(conn, _params) do
    IO.inspect("got to comment owner")
    user = conn.assigns[:current_user]
    event_id = conn.assigns[:event_id]
    event = Events.get_event!(event_id)
    %{"id" => id} = conn.params
    comment = Comments.get_comment!(id)
    IO.inspect(comment)
    if comment.user_id == user.id
      || event.owner_id == user.id do
      conn
    else
      conn
      |> put_resp_header(
        "content-type", "application/json; charset=UTF-8")
      |> send_resp(
        :unprocessable_entity,
        Jason.encode!(%{"error" => "No modify access to this comment."})
      )
      |> halt()
    end
  end
end
