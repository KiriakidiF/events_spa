# Based on lecture code 18-passwords
defmodule EventsServerWeb.SessionController do
  use EventsServerWeb, :controller

  @spec create(Plug.Conn.t(), map) :: Plug.Conn.t()
  def create(conn, %{"email" => email, "password" => password}) do
    user = EventsServer.Users.authenticate(email, password)
    if user do
      sess = %{
        user_id: user.id,
        name: user.name,
        email: user.email,
        token: Phoenix.Token.sign(conn, "user_id", user.id)
      }
      conn
      |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
      |> send_resp(
        :created,
        Jason.encode!(%{session: sess})
      )
    else
      conn
      |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
      |> send_resp(
        :unauthorized,
        Jason.encode!(%{error: "Could not create session."})
      )
    end
  end
end
