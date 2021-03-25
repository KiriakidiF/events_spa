defmodule EventsServerWeb.InviteController do
  use EventsServerWeb, :controller

  alias EventsServer.Invites
  alias EventsServer.Invites.Invite

  alias EventsServerWeb.Plugs
  plug :require_event_id when action in [:index]
  #plug Plugs.RequireAuth

  action_fallback EventsServerWeb.FallbackController

  # Require an event id and place in conn assigns as integer
  def require_event_id(conn, _params) do
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

  def index(conn, _params) do
    invites = Invites.list_invites()
    event_id = conn.assigns[:event_id]
    invites = Enum.filter(invites, fn inv -> inv.event.id == event_id end)
    render(conn, "index.json", invites: invites)
  end

  def create(conn, %{"invite" => invite_params}) do
    with {:ok, %Invite{} = invite} <- Invites.create_invite(invite_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.invite_path(conn, :show, invite))
      |> render("show.json", invite: invite)
    end
  end

  def show(conn, %{"id" => id}) do
    invite = Invites.get_invite!(id)
    render(conn, "show.json", invite: invite)
  end

  def update(conn, %{"id" => id, "invite" => invite_params}) do
    invite = Invites.get_invite!(id)

    with {:ok, %Invite{} = invite} <- Invites.update_invite(invite, invite_params) do
      render(conn, "show.json", invite: invite)
    end
  end

  def delete(conn, %{"id" => id}) do
    invite = Invites.get_invite!(id)

    with {:ok, %Invite{}} <- Invites.delete_invite(invite) do
      send_resp(conn, :no_content, "")
    end
  end
end
