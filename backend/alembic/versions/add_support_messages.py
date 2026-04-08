"""Create support_messages table

Revision ID: add_support_messages
Revises: 0abc2d7dd92a
Create Date: 2026-04-08

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_support_messages'
down_revision = '0abc2d7dd92a'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'support_messages',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('user_name', sa.String(), nullable=False),
        sa.Column('user_email', sa.String(), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('reply', sa.Text(), nullable=True),
        sa.Column('status', sa.String(), nullable=False, server_default='pendiente'),
        sa.Column('assigned_to_admin_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('resolved_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['assigned_to_admin_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_support_messages_assigned_to_admin_id'), 'support_messages', ['assigned_to_admin_id'], unique=False)
    op.create_index(op.f('ix_support_messages_created_at'), 'support_messages', ['created_at'], unique=False)
    op.create_index(op.f('ix_support_messages_user_email'), 'support_messages', ['user_email'], unique=False)
    op.create_index(op.f('ix_support_messages_user_id'), 'support_messages', ['user_id'], unique=False)


def downgrade():
    op.drop_index(op.f('ix_support_messages_user_id'), table_name='support_messages')
    op.drop_index(op.f('ix_support_messages_user_email'), table_name='support_messages')
    op.drop_index(op.f('ix_support_messages_created_at'), table_name='support_messages')
    op.drop_index(op.f('ix_support_messages_assigned_to_admin_id'), table_name='support_messages')
    op.drop_table('support_messages')
