'use client';

import React, { useState } from 'react';
import { ResumeData, Experience, Project, Certificate, Education, SkillCategory, Achievement } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { TrashDuo } from '@/components/icons';
import { DeleteConfirmPopover } from '@/components/ui/delete-confirm-popover';
import { TagInput } from './TagInput';
import { DataTable } from './DataTable';
import { ExperienceModal } from './ExperienceModal';
import { ProjectModal } from './ProjectModal';
import { CertificateModal } from './CertificateModal';
import { EducationModal } from './EducationModal';
import { AchievementModal } from './AchievementModal';
import CollapsibleSection from './CollapseSection';
import { cn } from 'cn';
import { toast } from 'sonner';

interface EditorFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  masterResume?: ResumeData | null;
  isChildResume?: boolean;
}

const normalizeItems = (items: (string | null)[]) => items.filter(Boolean) as string[];

export const EditorForm: React.FC<EditorFormProps> = ({
  data,
  onChange,
  masterResume = null,
  isChildResume = false,
}) => {
  const [openSection, setOpenSection] = useState<string | null>('personal');

  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleResetSection = (sectionKey: string, sectionTitle: string) => {
    if (!masterResume) {
      toast.error('Master resume not found');
      return;
    }

    const nextData: ResumeData = { ...data };

    switch (sectionKey) {
      case 'personal':
        nextData.personalInfo = {
          name: masterResume.personalInfo.name || '',
          email: masterResume.personalInfo.email ?? null,
          phone: masterResume.personalInfo.phone ?? null,
          location: masterResume.personalInfo.location ?? null,
          linkedin: masterResume.personalInfo.linkedin ?? null,
          github: masterResume.personalInfo.github ?? null,
          website: masterResume.personalInfo.website ?? null,
        };
        break;

      case 'summary':
        nextData.summary = masterResume.summary ?? '';
        break;

      case 'experience':
        nextData.experience = (masterResume.experience ?? []).map((exp) => ({
          id: exp.id || Date.now().toString() + Math.random().toString(36).substring(2, 5),
          company: exp.company || '',
          position: exp.position || '',
          location: exp.location ?? null,
          startDate: exp.startDate || '',
          endDate: exp.endDate ?? null,
          current: Boolean(exp.current),
          bullets: Array.isArray(exp.bullets) ? [...exp.bullets] : [],
        }));
        break;

      case 'projects':
        nextData.projects = (masterResume.projects ?? []).map((proj) => ({
          id: proj.id || Date.now().toString() + Math.random().toString(36).substring(2, 5),
          name: proj.name || '',
          description: proj.description || '',
          technologies: Array.isArray(proj.technologies) ? [...proj.technologies] : [],
          link: proj.link ?? null,
          bullets: Array.isArray(proj.bullets) ? [...proj.bullets] : [],
        }));
        break;

      case 'skills':
        nextData.skills = (masterResume.skills ?? []).map((skill) => ({
          category: skill.category || '',
          items: Array.isArray(skill.items) ? [...skill.items] : [],
        }));
        break;

      case 'education':
        nextData.education = (masterResume.education ?? []).map((edu) => ({
          id: edu.id || Date.now().toString() + Math.random().toString(36).substring(2, 5),
          institution: edu.institution || '',
          degree: edu.degree || '',
          field: edu.field ?? null,
          location: edu.location ?? null,
          startDate: edu.startDate ?? null,
          endDate: edu.endDate ?? null,
          gpa: edu.gpa ?? null,
        }));
        break;

      case 'certifications':
        nextData.certifications = (masterResume.certifications ?? []).map((cert) => ({
          id: cert.id || Date.now().toString() + Math.random().toString(36).substring(2, 5),
          name: cert.name || '',
          issuer: cert.issuer || '',
          date: cert.date ?? null,
          link: cert.link ?? null,
        }));
        break;

      case 'achievements':
        nextData.achievements = (masterResume.achievements ?? []).map((ach) => ({
          id: ach.id || Date.now().toString() + Math.random().toString(36).substring(2, 5),
          title: ach.title || '',
          description: ach.description || '',
        }));
        break;

      default:
        return;
    }

    onChange(nextData);
    toast.success(`${sectionTitle} reset to master resume`);
  };

  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value },
    });
  };

  const updateSummary = (value: string) => {
    onChange({ ...data, summary: value });
  };

  const updateSkillCategory = (index: number, value: string) => {
    const next = data.skills.map((skill, i) =>
      i === index ? { ...skill, category: value } : skill
    );
    onChange({ ...data, skills: next });
  };

  const updateSkillItems = (index: number, items: string[]) => {
    const next = data.skills.map((skill, i) =>
      i === index ? { ...skill, items } : skill
    );
    onChange({ ...data, skills: next });
  };

  const addSkillCategory = () => {
    const nextCategory: SkillCategory = { category: '', items: [] };
    onChange({ ...data, skills: [...data.skills, nextCategory] });
  };

  const deleteSkillCategory = (index: number) => {
    onChange({ ...data, skills: data.skills.filter((_, i) => i !== index) });
  };

  // Experience handlers
  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      bullets: [],
    };
    setEditingExperience(newExp);
  };

  const saveExperience = (exp: Experience) => {
    const exists = data.experience.find(e => e.id === exp.id);
    if (exists) {
      onChange({
        ...data,
        experience: data.experience.map(e => e.id === exp.id ? exp : e),
      });
    } else {
      onChange({ ...data, experience: [...data.experience, exp] });
    }
    setEditingExperience(null);
  };

  const deleteExperience = (id: string) => {
    onChange({
      ...data,
      experience: data.experience.filter(e => e.id !== id),
    });
  };

  const reorderExperience = (newOrder: Experience[]) => {
    onChange({ ...data, experience: newOrder });
  };

  // Project handlers
  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      link: '',
      bullets: [],
    };
    setEditingProject(newProject);
  };

  const saveProject = (proj: Project) => {
    const exists = data.projects.find(p => p.id === proj.id);
    if (exists) {
      onChange({
        ...data,
        projects: data.projects.map(p => p.id === proj.id ? proj : p),
      });
    } else {
      onChange({ ...data, projects: [...data.projects, proj] });
    }
    setEditingProject(null);
  };

  const deleteProject = (id: string) => {
    onChange({
      ...data,
      projects: data.projects.filter(p => p.id !== id),
    });
  };

  const reorderProjects = (newOrder: Project[]) => {
    onChange({ ...data, projects: newOrder });
  };

  // Certificate handlers
  const addCertificate = () => {
    const newCert: Certificate = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      link: '',
    };
    setEditingCertificate(newCert);
  };

  const saveCertificate = (cert: Certificate) => {
    const certificates = data.certifications ?? [];
    const exists = certificates.find(c => c.id === cert.id);
    if (exists) {
      onChange({
        ...data,
        certifications: certificates.map(c => c.id === cert.id ? cert : c),
      });
    } else {
      onChange({ ...data, certifications: [...certificates, cert] });
    }
    setEditingCertificate(null);
  };

  const deleteCertificate = (id: string) => {
    const certificates = data.certifications ?? [];
    onChange({
      ...data,
      certifications: certificates.filter(c => c.id !== id),
    });
  };

  const reorderCertificates = (newOrder: Certificate[]) => {
    onChange({ ...data, certifications: newOrder });
  };

  // Education handlers
  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
    };
    setEditingEducation(newEdu);
  };

  const saveEducation = (edu: Education) => {
    const exists = data.education.find(e => e.id === edu.id);
    if (exists) {
      onChange({
        ...data,
        education: data.education.map(e => e.id === edu.id ? edu : e),
      });
    } else {
      onChange({ ...data, education: [...data.education, edu] });
    }
    setEditingEducation(null);
  };

  const deleteEducation = (id: string) => {
    onChange({
      ...data,
      education: data.education.filter(e => e.id !== id),
    });
  };

  const reorderEducation = (newOrder: Education[]) => {
    onChange({ ...data, education: newOrder });
  };

  // Achievement handlers
  const addAchievement = () => {
    const newAch: Achievement = {
      id: Date.now().toString(),
      title: '',
      description: '',
    };
    setEditingAchievement(newAch);
  };

  const saveAchievement = (ach: Achievement) => {
    const achievements = data.achievements ?? [];
    const exists = achievements.find(a => a.id === ach.id);
    if (exists) {
      onChange({
        ...data,
        achievements: achievements.map(a => a.id === ach.id ? ach : a),
      });
    } else {
      onChange({ ...data, achievements: [...achievements, ach] });
    }
    setEditingAchievement(null);
  };

  const deleteAchievement = (id: string) => {
    const achievements = data.achievements ?? [];
    onChange({
      ...data,
      achievements: achievements.filter(a => a.id !== id),
    });
  };

  const reorderAchievements = (newOrder: Achievement[]) => {
    onChange({ ...data, achievements: newOrder });
  };


  return (
    <div className="h-full overflow-y-auto nobar overscroll-none bg-background overflow-hidden mask-b-from-90%">
      <div className="space-y-0 pb-16">
        <CollapsibleSection
          title="Personal Information"
          isOpen={openSection === 'personal'}
          onToggle={() => toggleSection('personal')}
          sectionKey="personal"
          onReset={isChildResume && masterResume ? () => handleResetSection('personal', 'Personal Information') : undefined}
        >
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="fullName" className="text-xs text-primary/90 mb-1">Full Name</Label>
                <Input
                  id="fullName"
                  value={data.personalInfo.name}
                  onChange={(e) => updatePersonalInfo('name', e.target.value)}
                  placeholder="John Doe"
                  className="h-9"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-xs text-primary/90 mb-1">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={data.personalInfo.email ?? ''}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  placeholder="you@mail.com"
                  className="h-9"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="phone" className="text-xs text-primary/90 mb-1">Phone</Label>
                <Input
                  id="phone"
                  value={data.personalInfo.phone ?? ''}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="h-9"
                />
              </div>
              <div>
                <Label htmlFor="location" className="text-xs text-primary/90 mb-1">Location</Label>
                <Input
                  id="location"
                  value={data.personalInfo.location ?? ''}
                  onChange={(e) => updatePersonalInfo('location', e.target.value)}
                  placeholder="San Francisco, CA"
                  className="h-9"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="website" className="text-xs text-primary/90 mb-1">Website</Label>
                <Input
                  id="website"
                  value={data.personalInfo.website ?? ''}
                  onChange={(e) => updatePersonalInfo('website', e.target.value)}
                  placeholder="yoursite.com"
                  className="h-9"
                />
              </div>
              <div>
                <Label htmlFor="linkedin" className="text-xs text-primary/90 mb-1">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={data.personalInfo.linkedin ?? ''}
                  onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                  placeholder="linkedin.com/in/..."
                  className="h-9"
                />
              </div>
              <div>
                <Label htmlFor="github" className="text-xs text-primary/90 mb-1">GitHub</Label>
                <Input
                  id="github"
                  value={data.personalInfo.github ?? ''}
                  onChange={(e) => updatePersonalInfo('github', e.target.value)}
                  placeholder="github.com/..."
                  className="h-9"
                />
              </div>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          key="summary"
          title="Summary"
          isOpen={openSection === 'summary'}
          onToggle={() => toggleSection('summary')}
          sectionKey="summary"
          onReset={isChildResume && masterResume ? () => handleResetSection('summary', 'Summary') : undefined}
        >
          <Textarea
            value={data.summary ?? ''}
            onChange={(e) => updateSummary(e.target.value)}
            placeholder="Brief overview of your professional background and key strengths..."
            rows={6}
            className="resize-none max-h-40"
          />
        </CollapsibleSection>

        <CollapsibleSection
          key="experience"
          title={`Experience ${data.experience.length >= 1 ? `(${data.experience.length})` : ''}`}
          isOpen={openSection === 'experience'}
          onToggle={() => toggleSection('experience')}
          sectionKey="experience"
          onReset={isChildResume && masterResume ? () => handleResetSection('experience', 'Experience') : undefined}
        >
          <div className="space-y-3">
            {data.experience.length > 0 && (
              <DataTable
                data={data.experience}
                columns={[
                  { key: 'position', label: 'Position' },
                  { key: 'company', label: 'Company' },
                  { key: 'startDate', label: 'Period', render: (item) => `${item.startDate} - ${item.current ? 'Present' : item.endDate ?? ''}` },
                ]}
                onEdit={setEditingExperience}
                onDelete={deleteExperience}
                onReorder={reorderExperience}
              />
            )}
            <div className="w-full flex justify-center items-center">
              <Button onClick={addExperience} size="sm" variant="outline" className={cn("w-full gap-2 h-9 border-dashed",
              )}>
                <Plus className="w-4 h-4" /> Add Experience
              </Button>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          key="projects"
          title={`Projects ${data.projects.length >= 1 ? `(${data.projects.length})` : ''}`}
          isOpen={openSection === 'projects'}
          onToggle={() => toggleSection('projects')}
          sectionKey="projects"
          onReset={isChildResume && masterResume ? () => handleResetSection('projects', 'Projects') : undefined}
        >
          <div className="space-y-3">
            {data.projects.length > 0 && (
              <DataTable
                data={data.projects}
                columns={[
                  { key: 'name', label: 'Project Name' },
                  {
                    key: 'technologies',
                    label: 'Technologies',
                    render: (item) => {
                      const techs = normalizeItems(item.technologies);
                      return techs.slice(0, 3).join(', ') + (techs.length > 3 ? '...' : '');
                    },
                  },
                ]}
                onEdit={setEditingProject}
                onDelete={deleteProject}
                onReorder={reorderProjects}
              />
            )}
            <div className="w-full flex justify-center items-center">
              <Button onClick={addProject} size="sm" variant="outline" className="w-full gap-2 h-9 border-dashed">
                <Plus className="w-4 h-4" /> Add Project
              </Button>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          key="skills"
          title={`Skills ${data.skills.length >= 1 ? `(${data.skills.length})` : ''}`}
          isOpen={openSection === 'skills'}
          onToggle={() => toggleSection('skills')}
          sectionKey="skills"
          onReset={isChildResume && masterResume ? () => handleResetSection('skills', 'Skills') : undefined}
        >
          <div className="space-y-3">
            {data.skills.length === 0 && (
              <p className="text-xs text-muted-foreground">Add categories like Languages, Frameworks, or Tools.</p>
            )}
            {data.skills.map((skill, index) => (
              <div key={`${skill.category}-${index}`} className="rounded-md border p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    value={skill.category}
                    onChange={(e) => updateSkillCategory(index, e.target.value)}
                    placeholder="Category"
                    className="h-9"
                  />
                  <DeleteConfirmPopover
                    title="Delete skill category?"
                    description={`Are you sure you want to remove "${skill.category || 'Untitled'}" and all its skills?`}
                    confirmText="Delete"
                    onConfirm={() => deleteSkillCategory(index)}
                    side="top"
                    align="end"
                    compact
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 data-[state=open]:text-destructive data-[state=open]:bg-destructive/10 cursor-pointer"
                      title="Delete category"
                    >
                      <TrashDuo className="size-4" />
                    </Button>
                  </DeleteConfirmPopover>
                </div>
                <TagInput
                  tags={normalizeItems(skill.items)}
                  onChange={(items) => updateSkillItems(index, items)}
                  placeholder="Type a skill and press Enter..."
                />

              </div>
            ))}
            <Button onClick={addSkillCategory} size="sm" variant="outline" className="w-full gap-2 h-9 border-dashed">
              <Plus className="w-4 h-4" /> Add Skill Category
            </Button>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          key="education"
          title={`Education ${data.education.length >= 1 ? `(${data.education.length})` : ''}`}
          isOpen={openSection === 'education'}
          onToggle={() => toggleSection('education')}
          sectionKey="education"
          onReset={isChildResume && masterResume ? () => handleResetSection('education', 'Education') : undefined}
        >
          <div className="space-y-3">
            {data.education.length > 0 && (
              <DataTable
                data={data.education}
                columns={[
                  { key: 'degree', label: 'Degree' },
                  { key: 'institution', label: 'Institution' },
                  { key: 'startDate', label: 'Period', render: (item) => `${item.startDate ?? ''} - ${item.endDate ?? 'Present'}` },
                ]}
                onEdit={setEditingEducation}
                onDelete={deleteEducation}
                onReorder={reorderEducation}
              />
            )}
            <div className="w-full flex justify-center items-center">
              <Button onClick={addEducation} size="sm" variant="outline" className="w-full gap-2 h-9 border-dashed">
                <Plus className="w-4 h-4" /> Add Education
              </Button>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          key="certifications"
          title={`Certifications ${(data.certifications ?? []).length >= 1 ? `(${(data.certifications ?? []).length})` : ''}`}
          isOpen={openSection === 'certifications'}
          onToggle={() => toggleSection('certifications')}
          sectionKey="certifications"
          onReset={isChildResume && masterResume ? () => handleResetSection('certifications', 'Certifications') : undefined}
        >
          <div className="space-y-3">
            {(data.certifications ?? []).length > 0 && (
              <DataTable
                data={data.certifications ?? []}
                columns={[
                  { key: 'name', label: 'Certificate' },
                  { key: 'issuer', label: 'Issuer' },
                  { key: 'date', label: 'Date' },
                ]}
                onEdit={setEditingCertificate}
                onDelete={deleteCertificate}
                onReorder={reorderCertificates}
              />
            )}
            <div className="w-full flex justify-center items-center">
              <Button onClick={addCertificate} size="sm" variant="outline" className="w-full gap-2 h-9 border-dashed">
                <Plus className="w-4 h-4" /> Add Certification
              </Button>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          key="achievements"
          title={`Achievements ${(data.achievements ?? []).length >= 1 ? `(${(data.achievements ?? []).length})` : ''}`}
          isOpen={openSection === 'achievements'}
          onToggle={() => toggleSection('achievements')}
          sectionKey="achievements"
          onReset={isChildResume && masterResume ? () => handleResetSection('achievements', 'Achievements') : undefined}
        >
          <div className="space-y-3">
            {(data.achievements ?? []).length > 0 && (
              <DataTable
                data={data.achievements ?? []}
                columns={[
                  { key: 'title', label: 'Title' },
                  { key: 'description', label: 'Description', render: (item) => (item.description ? (item.description.slice(0, 30) + '...') : '') },
                ]}
                onEdit={setEditingAchievement}
                onDelete={deleteAchievement}
                onReorder={reorderAchievements}
              />
            )}
            <div className="w-full flex justify-center items-center">
              <Button onClick={addAchievement} size="sm" variant="outline" className="w-full gap-2 h-9 border-dashed">
                <Plus className="w-4 h-4" /> Add Achievement
              </Button>
            </div>
          </div>
        </CollapsibleSection>
      </div>

      {editingExperience && (
        <ExperienceModal
          experience={editingExperience}
          onSave={saveExperience}
          onClose={() => setEditingExperience(null)}
        />
      )}
      {editingProject && (
        <ProjectModal
          project={editingProject}
          onSave={saveProject}
          onClose={() => setEditingProject(null)}
        />
      )}
      {editingCertificate && (
        <CertificateModal
          certificate={editingCertificate}
          onSave={saveCertificate}
          onClose={() => setEditingCertificate(null)}
        />
      )}
      {editingEducation && (
        <EducationModal
          education={editingEducation}
          onSave={saveEducation}
          onClose={() => setEditingEducation(null)}
        />
      )}
      {editingAchievement && (
        <AchievementModal
          achievement={editingAchievement}
          onSave={saveAchievement}
          onClose={() => setEditingAchievement(null)}
        />
      )}
    </div>
  );
};
