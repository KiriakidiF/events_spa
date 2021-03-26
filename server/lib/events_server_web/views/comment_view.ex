defmodule EventsServerWeb.CommentView do
  use EventsServerWeb, :view
  alias EventsServerWeb.CommentView
  alias EventsServerWeb.UserView
  alias EventsServer.Repo

  def render("index.json", %{comments: comments}) do
    %{data: render_many(comments, CommentView, "comment.json")}
  end

  def render("show.json", %{comment: comment}) do
    IO.inspect("GOT TO SHOW")
    %{data: render_one(comment, CommentView, "comment.json")}
  end

  def render("comment.json", %{comment: comment}) do
    IO.inspect("GOT TO Render")
    user = if Ecto.assoc_loaded?(comment.user) do
      render_one(comment.user, UserView, "user.json")
    else
      IO.inspect("Preloading")
      comment = Repo.preload(comment, :user)
      render_one(comment.user, UserView, "user.json")
    end
    IO.inspect("SENDING")
    %{id: comment.id,
      body: comment.body,
      user: user}
  end
end
