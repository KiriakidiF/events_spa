defmodule EventsServer.Repo.Migrations.CreateEvents do
  use Ecto.Migration

  def change do
    create table(:events) do
      add :name, :string, null: false
      add :date, :utc_datetime, null: false
      add :desc, :string, null: false
      add :owner_id, references(:users, on_delete: :nothing), null: false

      timestamps()
    end

    create index(:events, [:owner_id])
  end
end
