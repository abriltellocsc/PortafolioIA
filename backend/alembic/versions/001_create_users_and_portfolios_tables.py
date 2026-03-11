"""create users and portfolios tables

Revision ID: 001
Revises: 
Create Date: 2024-01-01 00:00:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create users table
    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('password_hash', sa.String(), nullable=True),
        sa.Column('country', sa.String(), nullable=True),
        sa.Column('experience_level', sa.String(), nullable=True),
        sa.Column('investment_goal', sa.Text(), nullable=True),
        sa.Column('risk_profile_answers', sa.JSON(), nullable=True),
        sa.Column('preferences', sa.JSON(), nullable=True),
        sa.Column('role', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('google_id', sa.String(), nullable=True),
        sa.Column('picture', sa.String(), nullable=True),
        sa.Column('email_verified', sa.Boolean(), nullable=True),
        sa.Column('verification_token', sa.String(), nullable=True),
        sa.Column('verification_exp', sa.DateTime(timezone=True), nullable=True),
        sa.Column('reset_token', sa.String(), nullable=True),
        sa.Column('reset_token_exp', sa.DateTime(timezone=True), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('is_premium', sa.Boolean(), nullable=True),
        sa.Column('subscription_id', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        sa.UniqueConstraint('google_id')
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)

    # Create portfolios table
    op.create_table('portfolios',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('generated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('metrics', sa.JSON(), nullable=False),
        sa.Column('simulation_history', sa.JSON(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_portfolios_id'), 'portfolios', ['id'], unique=False)

    # Create assets table
    op.create_table('assets',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('portfolio_id', sa.Integer(), nullable=False),
        sa.Column('ticker', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('allocation_pct', sa.Float(), nullable=False),
        sa.Column('reason', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['portfolio_id'], ['portfolios.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_assets_id'), 'assets', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_assets_id'), table_name='assets')
    op.drop_table('assets')
    op.drop_index(op.f('ix_portfolios_id'), table_name='portfolios')
    op.drop_table('portfolios')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_table('users')