"""Add educational_content table

Revision ID: add_educational_content
Revises: merge_add_support_messages_1a2b3c4d5e6f
Create Date: 2026-04-18

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_educational_content'
down_revision = 'merge_add_support_messages_1a2b3c4d5e6f'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'educational_content',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('category', sa.String(length=50), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('summary', sa.Text(), nullable=False),
        sa.Column('tags', sa.Text(), nullable=False),
        sa.Column('full_content', sa.Text(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=True, default=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_educational_content_created_at'), 'educational_content', ['created_at'], unique=False)
    op.create_index(op.f('ix_educational_content_id'), 'educational_content', ['id'], unique=False)


def downgrade():
    op.drop_index(op.f('ix_educational_content_id'), table_name='educational_content')
    op.drop_index(op.f('ix_educational_content_created_at'), table_name='educational_content')
    op.drop_table('educational_content')