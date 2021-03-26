defmodule EventsServerWeb.CommentController do
  use EventsServerWeb, :controller

  alias EventsServer.Comments
  alias EventsServer.Comments.Comment

  alias EventsServerWeb.Plugs
  plug Plugs.RequireAuth
  plug Plugs.RequireEventId
  plug Plugs.RequireCommentOwner when action in [:update, :delete]

  action_fallback EventsServerWeb.FallbackController


  def index(conn, _params) do
    comments = Comments.list_comments()
    render(conn, "index.json", comments: comments)
  end

  def create(conn, %{"comment" => comment_params}) do
    IO.inspect("got to create")
    comment_params = comment_params
    |> Map.put("user_id", conn.assigns[:current_user].id)
    |> Map.put("event_id", conn.assigns[:event_id])
    create = Comments.create_comment(comment_params)
    IO.inspect(create)
    with {:ok, %Comment{} = comment} <- create do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.comment_path(conn, :show, comment))
      |> render("show.json", comment: comment)
    end
  end

  def show(conn, %{"id" => id}) do
    comment = Comments.get_comment!(id)
    render(conn, "show.json", comment: comment)
  end

  def update(conn, %{"id" => id, "comment" => comment_params}) do
    comment = Comments.get_comment!(id)

    with {:ok, %Comment{} = comment} <- Comments.update_comment(comment, comment_params) do
      render(conn, "show.json", comment: comment)
    end
  end

  def delete(conn, %{"id" => id}) do
    comment = Comments.get_comment!(id)

    with {:ok, %Comment{}} <- Comments.delete_comment(comment) do
      send_resp(conn, :no_content, "")
    end
  end
end
