# 🚀 Resume Matcher & Agentic Resume Editor

## 📌 Overview

This project is an **AI-powered Resume Matcher and Editor** that helps users optimize their resumes based on a given Job Description (JD).

Unlike traditional tools, this system is **agent-driven**, meaning users can:

* Chat with an AI assistant
* Automatically modify their resume
* Tailor resumes per job in real-time

The system follows a **Master Resume → Multiple Tailored Versions** approach.

---

# 🎯 Goals

* Maintain a strong master resume
* Generate job-specific resume versions
* Improve resume-job match score
* Provide actionable suggestions
* Enable real-time AI editing

---

# 🧱 Core Concept

## Master Resume

* Single comprehensive resume
* Contains all skills, experience, and projects
* Acts as the base for all versions

## Resume Versions

* Created from Master Resume
* Tailored for specific job descriptions
* Optimized for each application

---

# 🔄 System Flow (Your Model)

## Step 1: Master Resume Creation

* User uploads resume OR enters details manually
* System converts it into structured JSON
* Stored as **Master Resume**

User can:

* Edit manually
* Enhance using AI

---

## Step 2: Master Resume Enhancement

* AI analyzes the Master Resume
* Ask clarifying questions to fill gaps
* Visit external sources (LinkedIn, GitHub, project links) to enrich content
* AI improves:
  * Bullet points
  * Summary
  * Skills
* Ensures strong baseline

---

## Step 3: Create Resume Version

* User inputs a Job Description (JD)
* Clicks: **Create Version**

System:

* Clones Master Resume
* Links it with JD

---

## Step 4: JD Analysis

* Extract:

  * Skills
  * Responsibilities
  * Keywords

---

## Step 5: Tailoring Process

AI:

* Rewrites experience
* Injects keywords
* Highlights relevant skills

User:

* Accept / reject edits
* Ask for refinements

---

## Step 6: Agent Interaction

User chats with AI:

Example:
"Improve this resume for backend role"

Agent:

* Reads JD
* Compares resume
* Calls tools
* Updates resume

---

## Step 7: Version Management

* Each version is saved separately
* Linked to a job
* User can:

  * Edit
  * Duplicate
  * Delete

---

## Step 8: Continuous Improvement

* Master resume updates
* Optionally sync changes to versions

---

## Step 9: Export

* Export specific version
* Apply to job

---

# 🤖 Agentic Sidebar

## Capabilities

* Understand intent
* Modify resume
* Suggest improvements
* Explain changes

---

# 🧰 Agent Tools

* get_resume
* update_section
* rewrite_bullet
* match_score_tool
* jd_parser_tool
* keyword_injector
* quantify_impact_tool
* ats_checker
* generate_summary
* project_suggester
* resume_version_manager
* export_resume
* ask_questions
* visit_external_source

---

# 🧠 Architecture

## Frontend

* Next.js
* Tailwind CSS
* Canvas Editor

## Backend

* Convex
* Stores:

  * Master Resume
  * Versions
  * JD data

## AI Layer

* LLM + tool calling

---

# 📦 Data Structure

```json
{
  "masterResume": {},
  "versions": [
    {
      "jobId": "",
      "resume": {}
    }
  ]
}
```

---

# 🎨 UI Layout

* Three-column layout:
* Left: Resume Editor (Collapsable)
* Center: Resume Preview
* Right: Agent Chat (Collapsable)

* Top bar: Version management, export options, and JD input/editing
---

# 🏁 Summary

This system works as a **resume operating system**:

* One Master Resume
* Multiple tailored versions
* AI agent for editing and optimization

It ensures efficiency, personalization, and better job matching.
