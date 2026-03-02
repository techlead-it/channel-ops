import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Play, Pause, AlertTriangle, Bell, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import type { Json } from '@/integrations/supabase/types';

type Priority = 'low' | 'medium' | 'high' | 'critical';

interface EscalationRule {
  id: string;
  name: string;
  description: string | null;
  trigger_type: string;
  trigger_conditions: Json;
  actions: Json;
  priority: Priority;
  is_active: boolean;
  tenant_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

const priorityConfig: Record<Priority, { label: string; class: string }> = {
  low: { label: '低', class: 'bg-muted text-muted-foreground' },
  medium: { label: '中', class: 'bg-status-warning-bg text-status-warning' },
  high: { label: '高', class: 'bg-status-critical-bg text-status-critical' },
  critical: { label: '緊急', class: 'bg-destructive text-destructive-foreground' },
};

const triggerTypes = [
  { value: 'alert_severity', label: 'アラート重大度' },
  { value: 'alert_count', label: 'アラート件数閾値' },
  { value: 'sla_breach', label: 'SLA違反予測' },
  { value: 'device_offline', label: 'デバイスオフライン' },
  { value: 'ticket_aging', label: 'チケット経過時間' },
];

export function WorkflowAutomation() {
  const { user, hasAnyRole } = useAuth();
  const [rules, setRules] = useState<EscalationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<EscalationRule | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formTriggerType, setFormTriggerType] = useState('alert_severity');
  const [formPriority, setFormPriority] = useState<Priority>('medium');
  const [formIsActive, setFormIsActive] = useState(true);

  const canManage = hasAnyRole(['admin', 'manager']);

  useEffect(() => {
    fetchRules();
  }, []);

  async function fetchRules() {
    try {
      const { data, error } = await supabase
        .from('escalation_rules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRules((data as EscalationRule[]) || []);
    } catch (error) {
      console.error('Error fetching escalation rules:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!user) return;

    try {
      if (editingRule) {
        const { error } = await supabase
          .from('escalation_rules')
          .update({
            name: formName,
            description: formDescription,
            trigger_type: formTriggerType,
            priority: formPriority,
            is_active: formIsActive,
          })
          .eq('id', editingRule.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('escalation_rules')
          .insert([{
            name: formName,
            description: formDescription,
            trigger_type: formTriggerType,
            priority: formPriority,
            is_active: formIsActive,
            created_by: user.id,
            trigger_conditions: {} as Json,
            actions: [] as Json,
          }]);

        if (error) throw error;
      }

      setDialogOpen(false);
      resetForm();
      fetchRules();
    } catch (error) {
      console.error('Error saving rule:', error);
    }
  }

  async function toggleRuleActive(rule: EscalationRule) {
    try {
      const { error } = await supabase
        .from('escalation_rules')
        .update({ is_active: !rule.is_active })
        .eq('id', rule.id);

      if (error) throw error;
      fetchRules();
    } catch (error) {
      console.error('Error toggling rule:', error);
    }
  }

  async function deleteRule(ruleId: string) {
    if (!confirm('このルールを削除しますか？')) return;

    try {
      const { error } = await supabase
        .from('escalation_rules')
        .delete()
        .eq('id', ruleId);

      if (error) throw error;
      fetchRules();
    } catch (error) {
      console.error('Error deleting rule:', error);
    }
  }

  function openEditDialog(rule: EscalationRule) {
    setEditingRule(rule);
    setFormName(rule.name);
    setFormDescription(rule.description || '');
    setFormTriggerType(rule.trigger_type);
    setFormPriority(rule.priority);
    setFormIsActive(rule.is_active);
    setDialogOpen(true);
  }

  function resetForm() {
    setEditingRule(null);
    setFormName('');
    setFormDescription('');
    setFormTriggerType('alert_severity');
    setFormPriority('medium');
    setFormIsActive(true);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">エスカレーションルール</h2>
          <p className="text-sm text-muted-foreground">
            自動通知・チケット作成・承認ワークフローを設定
          </p>
        </div>
        {canManage && (
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                ルール追加
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingRule ? 'ルールを編集' : '新規エスカレーションルール'}
                </DialogTitle>
                <DialogDescription>
                  条件に基づいて自動的にアクションを実行するルールを設定します
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">ルール名</Label>
                  <Input
                    id="name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="例: 重大アラート即時エスカレーション"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">説明</Label>
                  <Textarea
                    id="description"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="このルールの目的を説明..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>トリガー種別</Label>
                  <Select value={formTriggerType} onValueChange={setFormTriggerType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {triggerTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>優先度</Label>
                  <Select value={formPriority} onValueChange={(v) => setFormPriority(v as Priority)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">低</SelectItem>
                      <SelectItem value="medium">中</SelectItem>
                      <SelectItem value="high">高</SelectItem>
                      <SelectItem value="critical">緊急</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="active">有効にする</Label>
                  <Switch
                    id="active"
                    checked={formIsActive}
                    onCheckedChange={setFormIsActive}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  キャンセル
                </Button>
                <Button onClick={handleSave} disabled={!formName}>
                  {editingRule ? '更新' : '作成'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {rules.length === 0 ? (
        <div className="rounded-lg border bg-card p-8 text-center">
          <Bell className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 font-semibold">ルールがありません</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            エスカレーションルールを追加して、自動化を始めましょう
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {rules.map((rule) => {
            const priority = priorityConfig[rule.priority];
            const trigger = triggerTypes.find(t => t.value === rule.trigger_type);

            return (
              <div
                key={rule.id}
                className={cn(
                  'rounded-lg border bg-card p-4 transition-opacity',
                  !rule.is_active && 'opacity-50'
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full',
                      rule.is_active ? 'bg-primary/10' : 'bg-muted'
                    )}>
                      {rule.is_active ? (
                        <Play className="h-5 w-5 text-primary" />
                      ) : (
                        <Pause className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{rule.name}</h3>
                        <span className={cn('rounded px-2 py-0.5 text-xs font-medium', priority.class)}>
                          {priority.label}
                        </span>
                      </div>
                      {rule.description && (
                        <p className="mt-1 text-sm text-muted-foreground">{rule.description}</p>
                      )}
                      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {trigger?.label || rule.trigger_type}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(rule.created_at).toLocaleDateString('ja-JP')}
                        </span>
                      </div>
                    </div>
                  </div>
                  {canManage && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleRuleActive(rule)}
                        title={rule.is_active ? '無効にする' : '有効にする'}
                      >
                        {rule.is_active ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(rule)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteRule(rule.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
