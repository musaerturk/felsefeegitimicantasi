import React from 'react';

interface IconProps {
  className?: string;
}

// Tüm ikonları className prop'u alacak şekilde güncelle
export const LogoIcon = ({ className = '' }: IconProps) => <span className={className}>🏫</span>;
export const CalendarIcon = ({ className = '' }: IconProps) => <span className={className}>📅</span>;
export const BookIcon = ({ className = '' }: IconProps) => <span className={className}>📚</span>;
export const DocumentTextIcon = ({ className = '' }: IconProps) => <span className={className}>📝</span>;
export const LightBulbIcon = ({ className = '' }: IconProps) => <span className={className}>💡</span>;
export const ChartBarIcon = ({ className = '' }: IconProps) => <span className={className}>📊</span>;
export const CheckBadgeIcon = ({ className = '' }: IconProps) => <span className={className}>✅</span>;
export const UsersIcon = ({ className = '' }: IconProps) => <span className={className}>👥</span>;
export const SparklesIcon = ({ className = '' }: IconProps) => <span className={className}>✨</span>;
export const AcademicCapIcon = ({ className = '' }: IconProps) => <span className={className}>🎓</span>;
export const PrinterIcon = ({ className = '' }: IconProps) => <span className={className}>🖨️</span>;
export const ClipboardDocumentIcon = ({ className = '' }: IconProps) => <span className={className}>📋</span>;
export const ClipboardDocumentCheckIcon = ({ className = '' }: IconProps) => <span className={className}>📋✅</span>;
export const DocumentPlusIcon = ({ className = '' }: IconProps) => <span className={className}>📄</span>;
export const ChevronDownIcon = ({ className = '' }: IconProps) => <span className={className}>⬇️</span>;
export const PlusIcon = ({ className = '' }: IconProps) => <span className={className}>➕</span>;
export const TrashIcon = ({ className = '' }: IconProps) => <span className={className}>🗑️</span>;
export const EditIcon = ({ className = '' }: IconProps) => <span className={className}>✏️</span>;
export const SaveIcon = ({ className = '' }: IconProps) => <span className={className}>💾</span>;
export const LoaderIcon = ({ className = '' }: IconProps) => <span className={className}>⏳</span>;
export const CrossIcon = ({ className = '' }: IconProps) => <span className={className}>❌</span>;
export const ArrowRightIcon = ({ className = '' }: IconProps) => <span className={className}>→</span>;
export const ArrowLeftIcon = ({ className = '' }: IconProps) => <span className={className}>←</span>;
export const DownloadIcon = ({ className = '' }: IconProps) => <span className={className}>📥</span>;
export const UploadIcon = ({ className = '' }: IconProps) => <span className={className}>📤</span>;
export const SearchIcon = ({ className = '' }: IconProps) => <span className={className}>🔍</span>;
export const FilterIcon = ({ className = '' }: IconProps) => <span className={className}>⚡</span>;

// Named export olarak da ekle (Icons object'i için)
export const Icons = {
  Logo: LogoIcon,
  Calendar: CalendarIcon,
  Book: BookIcon,
  DocumentText: DocumentTextIcon,
  LightBulb: LightBulbIcon,
  ChartBar: ChartBarIcon,
  CheckBadge: CheckBadgeIcon,
  Users: UsersIcon,
  Sparkles: SparklesIcon,
  AcademicCap: AcademicCapIcon,
  Printer: PrinterIcon,
  ClipboardDocument: ClipboardDocumentIcon,
  ClipboardDocumentCheck: ClipboardDocumentCheckIcon,
  DocumentPlus: DocumentPlusIcon,
  ChevronDown: ChevronDownIcon,
  Plus: PlusIcon,
  Trash: TrashIcon,
  Edit: EditIcon,
  Save: SaveIcon,
  Loader: LoaderIcon,
  Cross: CrossIcon,
  ArrowRight: ArrowRightIcon,
  ArrowLeft: ArrowLeftIcon,
  Download: DownloadIcon,
  Upload: UploadIcon,
  Search: SearchIcon,
  Filter: FilterIcon,
};

export default Icons;
