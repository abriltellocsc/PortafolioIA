"""Add is_active column to users

Revision ID: 1a2b3c4d5e6f
Revises: 0abc2d7dd92a
Create Date: 2026-04-12 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1a2b3c4d5e6f'
down_revision: Union[str, Sequence[str], None] = '0abc2d7dd92a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('users', sa.Column('is_active', sa.Boolean(), server_default=sa.text('1'), nullable=False))


def downgrade() -> None:
    op.drop_column('users', 'is_active')
