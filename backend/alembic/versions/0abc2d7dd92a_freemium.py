"""Freemium - Add contador_ia and audit_logs

Revision ID: 0abc2d7dd92a
Revises: 001
Create Date: 2026-04-06 22:37:37.474041

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0abc2d7dd92a'
down_revision: Union[str, None] = '001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add contador_ia column to users table (for Freemium AI call limits)
    op.add_column('users', sa.Column('contador_ia', sa.Integer(), server_default='0', nullable=True))
    
    # Create audit_logs table
    op.create_table('audit_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('usuario_id', sa.Integer(), nullable=False),
        sa.Column('accion', sa.String(), nullable=False),
        sa.Column('detalle', sa.String(), nullable=True),
        sa.Column('fecha', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['usuario_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_audit_logs_usuario_id', 'audit_logs', ['usuario_id'], unique=False)
    op.create_index('ix_audit_logs_accion', 'audit_logs', ['accion'], unique=False)
    op.create_index('ix_audit_logs_fecha', 'audit_logs', ['fecha'], unique=False)


def downgrade() -> None:
    # Drop audit_logs table
    op.drop_index('ix_audit_logs_fecha', table_name='audit_logs')
    op.drop_index('ix_audit_logs_accion', table_name='audit_logs')
    op.drop_index('ix_audit_logs_usuario_id', table_name='audit_logs')
    op.drop_table('audit_logs')
    
    # Remove contador_ia column from users
    op.drop_column('users', 'contador_ia')