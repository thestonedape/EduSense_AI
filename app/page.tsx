import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, MessageCircleQuestion, Play } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { getCourses, getStudentDashboard } from "@/lib/api/server-services";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function StudentDashboardPage() {
  const user = await getSessionUser();
  const [subjects, dashboard] = await Promise.all([
    getCourses().catch(() => null),
    user ? getStudentDashboard(user.email).catch(() => null) : Promise.resolve(null),
  ]);
  const courses = subjects ?? [];
  const recent = dashboard?.recentLectures?.slice(0, 4) ?? [];
  const featured = courses.slice(0, 5);
  const greeting = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="ed-app">
      <Navbar />
      <main>
        <section className="ed-hero ed-container">
          <div className="ed-hero-copy">
            <div className="ed-eyebrow"><span className="ed-square" /> THE STUDENT DESK / 001</div>
            <p className="ed-greeting">Good to see you, {greeting}.</p>
            <h1>Make room<br />for <em>learning.</em></h1>
            <p className="ed-intro">Your lectures, notes, and questions. A little less searching, a lot more understanding.</p>
            <div className="ed-actions">
              <Link className="ed-button ed-button-dark" href="/courses">Browse subjects <ArrowUpRight size={17} /></Link>
              <Link className="ed-inline-link" href="/doubts">Ask a question <ArrowRight size={16} /></Link>
            </div>
          </div>
          <div className="ed-study-card">
            <div className="ed-card-top"><span>DESK / CURRENT SESSION</span><span className="ed-pulse">● {subjects === null ? "CONNECTING" : "READY"}</span></div>
            <div className="ed-card-intro"><span className="ed-glyph" aria-hidden="true"><i /><i /><i /></span><span>STUDY RECORD</span></div>
            <h2>Back to the<br />good stuff.</h2>
            {recent.length > 0 ? (
              <Link className="ed-next-lecture" href={"/lecture/" + recent[0].id}>
                <span><small>PICK UP WHERE YOU LEFT OFF</small><strong>{recent[0].lectureName}</strong></span>
                <ArrowUpRight size={18} />
              </Link>
            ) : (
              <div className="ed-next-lecture ed-no-link">
                <span><small>YOUR NEXT STEP</small><strong>{subjects === null ? "Connecting to your library…" : "Choose a subject to begin"}</strong></span>
                <BookOpen size={18} />
              </div>
            )}
            <div className="ed-card-bottom"><span>{String(courses.length).padStart(2, "0")} SUBJECTS</span><span>{String(recent.length).padStart(2, "0")} RECENT LECTURES</span><span>EDUSENSE ©</span></div>
          </div>
        </section>

        <section className="ed-section ed-container">
          <div className="ed-section-header">
            <div><p className="ed-eyebrow">01 / YOUR LIBRARY</p><h2>Subjects</h2></div>
            <Link className="ed-inline-link" href="/courses">View library <ArrowUpRight size={16} /></Link>
          </div>
          <div className="ed-subject-list">
            {featured.length > 0 ? featured.map((course, i) => (
              <Link href={"/course/" + course.id} key={course.id} className="ed-subject-row">
                <span className="ed-row-index">{String(i + 1).padStart(2, "0")}</span>
                <span className="ed-subject-main"><strong>{course.name}</strong><small>{course.code || "COURSE"}</small></span>
                <span className="ed-subject-count">{course.lectureCount} lecture{course.lectureCount === 1 ? "" : "s"}</span>
                <ArrowUpRight size={20} className="ed-row-arrow" />
              </Link>
            )) : (
              <div className="ed-empty">
                <BookOpen size={22} strokeWidth={1.5} />
                <p>{subjects === null ? "The library is reconnecting. Try again shortly." : "No reviewed subjects are available yet."}</p>
              </div>
            )}
          </div>
        </section>

        <section className="ed-lower ed-container">
          <div>
            <div className="ed-section-header ed-section-header-compact">
              <div><p className="ed-eyebrow">02 / CONTINUE</p><h2>Recent lectures</h2></div>
              <Link className="ed-inline-link" href="/practice">Practice <ArrowUpRight size={16} /></Link>
            </div>
            <div className="ed-recent-list">
              {recent.length > 0 ? recent.map((lecture) => (
                <Link href={"/lecture/" + lecture.id} key={lecture.id} className="ed-recent-row">
                  <span className="ed-play"><Play size={13} fill="currentColor" /></span>
                  <span><strong>{lecture.lectureName}</strong><small>{lecture.topicCount} topic{lecture.topicCount === 1 ? "" : "s"} · {lecture.lectureDate || "Ready to review"}</small></span>
                  <ArrowUpRight size={16} />
                </Link>
              )) : <div className="ed-recent-empty">Your recent lectures will show up here once you begin studying.</div>}
            </div>
          </div>
          <aside className="ed-question-panel">
            <div className="ed-eyebrow">A BETTER QUESTION / 03</div>
            <MessageCircleQuestion size={25} strokeWidth={1.35} />
            <h2>Something<br />not clicking?</h2>
            <p>Ask about a lecture and explore the answer with its study context.</p>
            <Link href="/doubts">Open doubt solver <ArrowUpRight size={17} /></Link>
          </aside>
        </section>
      </main>
      <footer className="ed-footer ed-container"><span>EDUSENSE / BUILT FOR FOCUSED STUDY</span><span>LECTURES → NOTES → QUESTIONS</span></footer>
    </div>
  );
}