"""Merge add_support_messages and add_user_is_active heads

Revision ID: merge_add_support_messages_1a2b3c4d5e6f
Revises: add_support_messages, 1a2b3c4d5e6f
Create Date: 2026-04-12 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'merge_add_support_messages_1a2b3c4d5e6f'
down_revision: Union[str, Sequence[str], None] = ('add_support_messages', '1a2b3c4d5e6f')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
