defmodule EventsServerWeb.InviteController do
  use EventsServerWeb, :controller

  alias EventsServer.Invites
  alias EventsServer.Invites.Invite

  alias EventsServerWeb.Plugs
  plug Plugs.RequireAuth
  plug Plugs.RequireEventId
  plug Plugs.RequireEventOwner when action in [:create, :delete]

  action_fallback EventsServerWeb.FallbackController

  def index(conn, _params) do
    invites = Invites.list_invites()
    event_id = conn.assigns[:event_id]
    invites = Enum.filter(invites, fn inv -> inv.event.id == event_id end)
    render(conn, "index.json", invites: invites)
  end

  def create(conn, %{"invite" => invite_params}) do
    invite_params = invite_params
    |> Map.put("event_id", conn.assigns[:event_id])
    create = Invites.create_invite(invite_params)
    with {:ok, %Invite{} = invite} <- create do
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
