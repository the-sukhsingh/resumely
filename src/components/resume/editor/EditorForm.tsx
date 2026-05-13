'use client';

import React, { useState } from 'react';
import { ResumeData, Experience, Project, Certificate, Education, SkillCategory, Achievement } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { TagInput } from './TagInput';
import { DataTable } from './DataTable';
import { ExperienceModal } from './ExperienceModal';
import { ProjectModal } from './ProjectModal';
import { CertificateModal } from './CertificateModal';
import { EducationModal } from './EducationModal';
import { AchievementModal } from './AchievementModal';
import CollapsibleSection from './CollapseSection';

interface EditorFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

const normalizeItems = (items: (string | null)[]) => items.filter(Boolean) as string[];

export const EditorForm: React.FC<EditorFormProps> = ({ data, onChange }) => {
  const [openSection, setOpenSection] = useState<string | null>('personal');

  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
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
        >
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-3">
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
            <div className="grid grid-cols-2 gap-3">
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
            <div className="grid grid-cols-3 gap-3">
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
        >
          <Textarea
            value={data.summary ?? ''}
            onChange={(e) => updateSummary(e.target.value)}
            placeholder="Brief overview of your professional background and key strengths..."
            rows={6}
            className="resize-none"
          />
        </CollapsibleSection>

        <CollapsibleSection
          key="experience"
          title={`Experience ${data.experience.length >= 1 ? `(${data.experience.length})` : ''}`}
          isOpen={openSection === 'experience'}
          onToggle={() => toggleSection('experience')}
          sectionKey="experience"
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
              <Button onClick={addExperience} size="sm" variant="outline" className="w-full gap-2 h-9 border-dashed">
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
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => deleteSkillCategory(index)}
                    className="h-9 w-9 "
                  >
                    <svg viewBox="0 0 24 24" className="size-1/2" fill="none"><g id="SVGRepo_bgCarrier" strokeWidth="0" /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M3 6.38597C3 5.90152 3.34538 5.50879 3.77143 5.50879L6.43567 5.50832C6.96502 5.49306 7.43202 5.11033 7.61214 4.54412C7.61688 4.52923 7.62232 4.51087 7.64185 4.44424L7.75665 4.05256C7.8269 3.81241 7.8881 3.60318 7.97375 3.41617C8.31209 2.67736 8.93808 2.16432 9.66147 2.03297C9.84457 1.99972 10.0385 1.99986 10.2611 2.00002H13.7391C13.9617 1.99986 14.1556 1.99972 14.3387 2.03297C15.0621 2.16432 15.6881 2.67736 16.0264 3.41617C16.1121 3.60318 16.1733 3.81241 16.2435 4.05256L16.3583 4.44424C16.3778 4.51087 16.3833 4.52923 16.388 4.54412C16.5682 5.11033 17.1278 5.49353 17.6571 5.50879H20.2286C20.6546 5.50879 21 5.90152 21 6.38597C21 6.87043 20.6546 7.26316 20.2286 7.26316H3.77143C3.34538 7.26316 3 6.87043 3 6.38597Z" className="fill-[#000000] dark:fill-[#ffffff]" /> <path d="M9.42543 11.4815C9.83759 11.4381 10.2051 11.7547 10.2463 12.1885L10.7463 17.4517C10.7875 17.8855 10.4868 18.2724 10.0747 18.3158C9.66253 18.3592 9.29499 18.0426 9.25378 17.6088L8.75378 12.3456C8.71256 11.9118 9.01327 11.5249 9.42543 11.4815Z" className="fill-[#000000] dark:fill-[#ffffff]" fillRule="evenodd" clipRule="evenodd" /> <path d="M14.5747 11.4815C14.9868 11.5249 15.2875 11.9118 15.2463 12.3456L14.7463 17.6088C14.7051 18.0426 14.3376 18.3592 13.9254 18.3158C13.5133 18.2724 13.2126 17.8855 13.2538 17.4517L13.7538 12.1885C13.795 11.7547 14.1625 11.4381 14.5747 11.4815Z" className="fill-[#000000] dark:fill-[#ffffff]" fillRule="evenodd" clipRule="evenodd" /> <path opacity="0.3" d="M11.5956 22.0001H12.4044C15.1871 22.0001 16.5785 22.0001 17.4831 21.1142C18.3878 20.2283 18.4803 18.7751 18.6654 15.8686L18.9321 11.6807C19.0326 10.1037 19.0828 9.31524 18.6289 8.81558C18.1751 8.31592 17.4087 8.31592 15.876 8.31592H8.12405C6.59127 8.31592 5.82488 8.31592 5.37105 8.81558C4.91722 9.31524 4.96744 10.1037 5.06788 11.6807L5.33459 15.8686C5.5197 18.7751 5.61225 20.2283 6.51689 21.1142C7.42153 22.0001 8.81289 22.0001 11.5956 22.0001Z" className="fill-[#000000] dark:fill-[#ffffff]" /> </g></svg>                  </Button>
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
