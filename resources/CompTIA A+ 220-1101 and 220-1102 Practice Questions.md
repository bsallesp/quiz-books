CompTIA A+ 220-1101 and 220-1102 Practice
Questions
CompTIA A+ certification is split into two exams – Core 1 (220-1101) and Core 2 (220-1102) – each covering
different  domains  of  IT  knowledge.  Below  is  a  curated  selection  of  realistic  multiple-choice  practice
questions for each major domain of 220-1101 and 220-1102, complete with answers and brief explanations.
These questions reflect the style and content of the real exams, targeting key concepts in the domains of
Mobile Devices, Networking, Hardware, Virtualization/Cloud, Hardware/Network Troubleshooting (for 1101)
and Operating Systems, Security, Software Troubleshooting, Operational Procedures (for 1102) . The
questions are inspired by reputable A+ study sources (Professor Messer, ExamCompass, Crucial Exams, Mike
Meyers, etc.) that the CompTIA community trusts for exam preparation. Citations and community insights
are provided to highlight why these sources and practice questions are valued by A+ candidates.
CompTIA A+ 220-1101 (Core 1) – Practice Questions by Domain
Exam 220-1101 Domains (Core 1): Mobile Devices (15%), Networking (20%), Hardware (25%), Virtualization &
Cloud Computing (11%), Hardware & Network Troubleshooting (29%) . Each domain is represented
below with sample question(s) and explanations.
Mobile Devices (Laptops, Tablets, Smartphones)
Sample Question: A technician notices that a customer’s smartphone battery is bulging and the phone’s
case is swollen. Which of the following actions should the technician take FIRST?
- A) Puncture the battery carefully to release the built-up gas
- B) Continue using the device until the battery fully discharges
- C) Power off the device and replace the swollen battery safely as per EPA guidelines
- D) Freeze the phone to cool down the battery before using it again 
Answer & Explanation: The correct answer is C). A swollen or bulging battery is dangerous – it can leak or
catch fire – so the device should be turned off immediately and the battery replaced/disposed of properly
(through  a  hazardous  e-waste  facility)  rather  than  used  further .  Puncturing  or  applying  extreme
temperatures to a swollen lithium battery is unsafe. The technician should not attempt to discharge or use
the device; the proper procedure is to handle the swollen battery with care (e.g. wearing safety gear) and
dispose of it according to hazardous waste guidelines . (In practice, manufacturers and CompTIA
guidelines emphasize  not  puncturing or mishandling swollen batteries and to  replace/Recycle  them
promptly for safety .)
Networking
Sample Question: A desktop PC is set to obtain an IP address automatically via DHCP. The user reports no
internet access, and the  ipconfig  output shows an IP of  169.254.x.x . The network cable and switch
port are known-good. Which of the following is the most likely cause?
1 2
1
3
3
3
1
- A) The DNS server is unreachable, causing name resolution to fail
- B) The DHCP server is down or unreachable, so the PC self-assigned an APIPA address
- C) The default gateway IP is misconfigured on the PC
- D) A duplicate IP address conflict exists on the network 
Answer & Explanation:  The symptoms indicate an  APIPA  address ( 169.254.*.* ), which Windows
assigns when a DHCP server cannot be reached. This means the PC did not get an IP from DHCP .
The most likely cause is that the DHCP server is down or not reachable (B), forcing the PC to self-assign
an Automatic Private IP Address. This results in no internet access beyond local subnet. By contrast, DNS
issues (A) would still show a valid IP (not 169.254), a wrong gateway (C) or IP conflict (D) would not usually
cause a 169.254 address. The APIPA address  169.254.x.x  is a clear sign of missing DHCP lease .
Resolving this would involve checking the DHCP server or network connection to it.
Hardware (PC Components, Peripherals, Printers)
Sample Question: A user’s laser printer is producing vertical black streaks on every printed page. Which of
the following components is most likely causing this issue?
- A) The fuser unit is overheating
- B) A worn or dirty drum unit (imaging drum)
- C) The paper feed rollers are worn out
- D) Low quality or thin paper causing jams 
Answer & Explanation: B) A worn or dirty drum unit is the most likely culprit for black vertical streaks on
laser printer output. Streaking on laser prints is usually caused by a spent toner cartridge or a worn
imaging drum . In laser printers, the drum (or toner cartridge in some designs) can develop lines or
debris that manifest as vertical streaks on prints. While a failing fuser can cause smudges or spots
(especially if not fusing toner properly), persistent straight vertical lines are characteristic of drum issues
. Replacing or cleaning the drum unit (or combined toner/drum cartridge, depending on the model)
typically resolves the streaking.
Virtualization and Cloud Computing
Sample Question:  A technician is deploying a solution on a cloud service. They have to  install the
operating system, then install the application and its data on the provided cloud server. Which type of
cloud service model is the technician using?
- A) SaaS – Software as a Service
- B) PaaS – Platform as a Service
- C) IaaS – Infrastructure as a Service
- D) DaaS – Desktop as a Service 
Answer & Explanation: This scenario describes Infrastructure as a Service (IaaS) (Option C). With IaaS,
the cloud provider supplies the infrastructure –  virtual hardware/VMs, storage, networking  – but the
customer is responsible for the  OS, runtime, and applications . In the question, the technician is
installing the OS and software on a cloud server, meaning the service provided was essentially a blank
virtual machine. By contrast, PaaS provides a pre-configured platform (OS and runtime) for deploying
applications (you wouldn’t install the OS in PaaS), and SaaS is a fully vendor-managed software solution (no
customer-installed OS or app – you just use the software via cloud). DaaS (Desktop as a Service) usually
4 5
4 5
6
6
7
2
refers to virtual desktop infrastructure provided as a service. The key is that in IaaS the customer manages
OS and above, which matches the question . 
Hardware and Network Troubleshooting
Sample Question: A user’s custom-built PC powers on, but no display and no beeps are observed. After
some troubleshooting, the technician finds that the motherboard’s 24-pin power connector was not fully
seated. Upon correcting this, the system boots normally. Which step of the troubleshooting process does
this scenario illustrate?
- A) Establish a theory of probable cause
- B) Test the theory and determine next steps
- C) Implement the solution and verify functionality
- D) Document findings and outcomes 
Answer & Explanation:  This scenario shows the technician implementing a fix and  verifying that it
resolved the problem, which corresponds to  Step C: Implement the solution and verify full system
functionality. In the CompTIA troubleshooting methodology, after identifying a likely cause (the unseated
power connector) and testing that theory, the next step is to implement the fix and ensure the issue is
resolved . Here, reseating the power connector was the fix implemented, and the PC booted normally
(functionality verified). The final step would be documentation (D), which comes after confirming the
solution. Initially, the technician would have gone through establishing and testing a theory (Steps A and B)
– for example, suspecting a power issue – but the question specifically describes the resolution step and the
successful boot, which is the implementation and verification phase of troubleshooting.
(Note: Hardware/Network troubleshooting questions often present a scenario and ask for next steps or best
solutions. In practice, always follow CompTIA’s structured methodology: identify the problem, establish a theory,
test the theory, implement the fix, verify full functionality, and document the outcome.)
CompTIA A+ 220-1102 (Core 2) – Practice Questions by Domain
Exam 220-1102 Domains (Core 2): Operating Systems (31%), Security (25%), Software Troubleshooting (22%),
Operational   Procedures   (22%) .   Below   are   sample   questions   for   each   domain   with   answers   and
explanations.
Operating Systems
Sample Question: Which of the following file systems is  commonly used by modern Windows operating
systems for the system partition, and supports features like file permissions and encryption?
- A) NTFS
- B) FAT32
- C) ext4
- D) APFS 
Answer & Explanation: A) NTFS (New Technology File System) is the primary file system used by modern
Windows OS for hard drive partitions, offering advanced features like NTFS permissions, encryption (EFS),
8
9
2
3
disk quotas, etc. Windows supports FAT32 and exFAT as well (mostly for removable media or backward
compatibility), but NTFS is the default for system volumes due to its robustness. The ext4 file system is used
by Linux, and APFS is used by macOS; neither ext4 nor APFS is natively supported for use as a Windows
system volume. In fact, Windows natively supports  NTFS, FAT32, and exFAT  file systems . NTFS was
introduced   by   Microsoft   and   is  specific to Windows  in   terms   of   design   (though   Linux/macOS   can
sometimes read NTFS, Windows is where it’s primarily used) . Therefore, NTFS is the best answer. (FAT32
and exFAT are older or special-purpose Windows file systems, ext4 and APFS are exclusive to Linux and
Apple, respectively.)
Security
Sample Question:  A user receives a text message that appears to be from their bank, warning of a
“suspicious login” and providing a link to verify their account. The user is being directed to a fake site via
SMS. What type of security attack is this?
- A) Phishing
- B) Vishing
- C) Smishing
- D) Spoofing 
Answer & Explanation: This scenario is describing SMS-based phishing, known as Smishing (Option C).
Smishing combines “SMS” + “phishing” and refers to fraudulent text messages crafted to trick individuals
into clicking malicious links or revealing personal info . In the example, the attacker is impersonating a
bank via SMS to deceive the user – a classic smishing tactic. Traditional phishing (A) usually refers to email-
based scams.  Vishing  (B) is voice phishing (phone calls).  Spoofing  (D) is a broader term for faking an
identity (which is happening here too), but the best specific term for SMS/text phishing is Smishing . The
takeaway: Anytime you get an unsolicited text with a link asking for personal or financial data, it’s likely a
smishing attempt and should be handled with the same caution as email phishing. 
Software Troubleshooting
Sample Question: After a recent video driver update, a user’s Windows 10 PC now crashes with a blue
screen (BSOD) during boot. Which of the following is the  BEST  way to quickly restore the system to a
working state without losing user files?
- A) Boot into Safe Mode and roll back the display driver to the previous version
- B) Perform a clean install of Windows, keeping nothing
- C) Replace the graphics card with a known-good model
- D) Boot to the Recovery Console and run  diskpart
Answer & Explanation: A) Booting into Safe Mode and rolling back the driver is the best first step. Safe
Mode starts Windows with minimal drivers, allowing the technician to undo or remove the faulty driver. In
Windows 10, you can press Shift + Restart to access advanced startup options and get into Safe Mode, then
use Device Manager to roll back or uninstall the problematic video driver. This preserves user files and
most settings . System Restore is another option if a restore point was created before the update, but
among the given choices, Safe Mode + driver rollback is explicitly focused on the driver issue. A clean OS
reinstall (B) is overkill and would wipe programs/settings. Replacing hardware (C) isn’t warranted unless the
card itself failed (here the timing suggests the new driver is the issue, not the physical GPU). Using
diskpart  (D) in Recovery Console is unrelated – that tool manages disk partitions, not driver problems.
10
10
11
11
9
4
This scenario aligns with CompTIA’s recommended troubleshooting steps: if a newly installed driver causes
boot errors, use Safe Mode, Last Known Good Configuration, or System Restore to revert the change
. Rolling back the driver in Safe Mode addresses the root cause (the bad update) while avoiding data
loss.
Operational Procedures
Sample Question: A help desk technician is on a support call with an angry customer whose internet is
not working. The customer is yelling and frustrated. What is the BEST approach for the technician to handle
this situation?
- A) Remain calm and professionally acknowledge the customer’s frustration, listening actively to concerns
- B) Raise your voice to assert control over the conversation and tell the customer to calm down
- C) Immediately escalate the call to a supervisor because the customer is upset
- D) Argue with the customer only if they are factually wrong, to correct their misunderstanding 
Answer & Explanation: A) The technician should stay calm, show empathy, and actively listen to the
customer’s concerns. This is a core customer service skill in IT support. Acknowledging the customer’s
frustration (e.g. “I understand how upsetting it is to lose your internet, and I’m here to help resolve this”)
can help defuse the situation . Keeping a composed tone and positive attitude, without arguing or
talking over the client, is crucial . The goal is to reassure the customer that you understand the
urgency and are working on a solution. Tactics like raising your voice or telling them to “calm down” (Option
B) are likely to escalate anger . Immediately escalating (C) isn’t the best first step either – often the front-
line tech should attempt to de-escalate; escalation is a last resort if the situation cannot be resolved or the
customer asks for a supervisor. Arguing with or correcting the customer harshly (D) will break trust and is
unprofessional. According to CompTIA’s objectives on communication,  effective communication and
professionalism  include using a polite tone, not interrupting, avoiding jargon, showing empathy, and
taking ownership of problems . In summary: listen, empathize, apologize for inconvenience, and
then solve the problem. This approach usually calms the client and leads to a better service experience.
Trusted Practice Question Resources (Community Opinions)
Preparing for A+ is made easier by practicing with high-quality question banks. The CompTIA study
community frequently mentions the following resources as trusted for realistic practice questions:
Professor Messer’s Practice Exams: Professor James “Messer” is highly respected for his free video
courses, and his  paid A+ practice exam book  is considered “top tier” by many examinees .
Students praise these practice questions for matching the feel, style, and difficulty of the actual
exams without using real exam items . Professor Messer himself notes that his practice exams
are designed to cover relevant exam topics without overcomplicating the scenarios . Community
feedback indicates these exams are an excellent readiness gauge – if you score well on Messer’s
tests, you’re likely ready for the real A+ .
ExamCompass:  ExamCompass offers  free online A+ practice tests  organized by exam domains
and subtopics. The community often recommends ExamCompass for the sheer volume of questions
and coverage of all objectives . Learners report that ExamCompass quizzes are sometimes a bit
9
12
12 13
14
12 13
• 
15
16
17
18
• 
19
5
more detailed or “wordy” than the actual exam, which can make the real test feel easier in
comparison . Despite the difference in style (ExamCompass questions tend to be straightforward
concept checks rather than long scenarios), they are great for drilling knowledge on ports, hardware
specs, acronyms, etc. In one user’s experience, “ExamCompass tests were harder than the actual exam”
(particularly for Core 1) , so scoring well on them can boost confidence. Overall, ExamCompass is
valued for  concept reinforcement  and identifying weak areas, especially since it’s free and no
registration is required.
Crucial Exams:  CrucialExams.com   provides   free   CompTIA   A+   practice   questions   with   detailed
explanations. The app/website is appreciated for mimicking the exam interface and for analytics that
help gauge performance by topic . One Reddit user mentioned that Crucial Exams’ questions
were  “more varied in scope”  and helped reveal knowledge gaps even after scoring high on other
practice exams . The community view is that using multiple sources is best, and Crucial Exams
can complement other practice tests by adding variety. (Do note that 220-1101/1102 were retired in
2025 and replaced by 220-1201/1202 , but Crucial Exams and others have updated their banks
accordingly – the core concepts remain the same.)
Mike Meyers’ Total Seminars Practice Tests: Mike Meyers is the author of the famous All-in-One
CompTIA A+ Certification Guide, and his company Total Seminars provides practice questions (in
books and a test engine called Total Tester). These questions are known for being comprehensive
and covering every exam objective, since they align with the content of his textbook. Many
learners use Meyers’ book questions for chapter review and report that they are quite accurate to
real-world scenarios and facts needed for the exam. Community feedback often suggests combining
Meyers’ training with other sources: e.g., “Mike Meyers’ course plus Jason Dion’s practice exams is a sure
pass” . In essence, Meyers’ practice questions are trusted for solid coverage, though some find
them a bit easier or more straightforward than actual exam wording. They serve as a good
knowledge check, especially when used alongside more challenging banks.
Jason Dion’s Practice Exams (Udemy):  Although not mentioned in the original query, it’s worth
noting (as per community consensus) that Jason Dion’s A+ practice exams on Udemy are widely used
and respected. Many Reddit users rank them alongside Professor Messer’s as extremely helpful.
Dion’s exams are known for being a tad more difficult or at least differently worded, which can make
the actual exam feel more familiar . For instance, it’s commonly advised that if you consistently
score ~85% or above on Dion’s practice tests, you’re likely ready for the real exam . His
questions often include scenario-based wording similar to CompTIA’s style, which is why they’re
recommended to augment other study materials . 
Why these sources?  The A+ community favors the above resources because they have  proven track
records. Professor Messer and Mike Meyers are CompTIA veterans whose content maps tightly to exam
objectives, ensuring no topic is missed. ExamCompass and Crucial Exams provide quantity and coverage,
which is great for drilling concepts (and they’re free). Jason Dion and Professor Messer’s paid practice exams
provide quality in terms of exam-like scenario questions and rationales. According to one top contributor,
using a combination of these – e.g., Messer’s videos and exams, plus Dion’s or ExamCompass for extra
questions – covers all bases for the A+ . 
Ultimately, the  most trusted practice questions  are those that  closely mirror the real exam content and
difficulty. By practicing with a curated mix of the above, candidates can build both the knowledge and test-
20
20
• 
21
21
22
• 
23
• 
24
25 26
24
15 19
6
taking skills needed to confidently tackle the A+ 220-1101 and 220-1102 exams. Good luck with your
certification! ✔
Sources:  CompTIA A+ official exam domain objectives ; Professor Messer’s advice and pop quiz
examples ; ExamCompass practice tests and user discussions ; Crucial Exams and Reddit
feedback ; Mike Meyers and Jason Dion community recommendations ; general tech references
for explanations . 
What Is on the CompTIA A+ (1101/1102) Exam? | CompTIA Blog
https://www.comptia.org/en-us/blog/what-is-on-the-comptia-a-exam/
Troubleshooting Mobile Devices - CompTIA A+ 220-1101 - 5.5 - Professor Messer IT Certification Training
Courses
https://www.professormesser.com/free-a-plus-training/220-1101/220-1101-video/troubleshooting-mobile-devices-220-1101/
What is Automatic Private IP Addressing (APIPA)?
https://www.cbtnuggets.com/blog/technology/networking/what-is-automatic-private-ip-addressing-apipa
How can I fix my laser printer's streaking issue?
https://support.ldproducts.com/en_us/how-can-i-fix-my-laser-printer%27s-streaking-issue-BkqDmFy8D
PaaS vs IaaS vs SaaS: What's the difference? | Google Cloud
https://cloud.google.com/learn/paas-vs-iaas-vs-saas
Troubleshooting Windows - CompTIA A+ 220-1102 - 3.1 - Professor Messer IT Certification Training
Courses
https://www.professormesser.com/free-a-plus-training/220-1102/220-1102-video/troubleshooting-windows-220-1102/
Exam Compass 1102 Practice Exam 8 Question Confusion : r/CompTIA
https://www.reddit.com/r/CompTIA/comments/170y4r7/exam_compass_1102_practice_exam_8_question/
What Is Smishing? Examples, Protection & More | Proofpoint US
https://www.proofpoint.com/us/threat-reference/smishing
Good Communication Skills - CompTIA A+ Prep 
https://www.vce-download.net/study-guide/comptia-aplus-6.4-good-communication-skills.html
57 Phrases to De-escalate Any Angry Customer - YouTube
https://www.youtube.com/watch?v=1e7OH-veEUY
Good practice tests for A+? : r/CompTIA
https://www.reddit.com/r/CompTIA/comments/1cwotfl/good_practice_tests_for_a/
Professor Messer's practice exams precision? : r/CompTIA
https://www.reddit.com/r/CompTIA/comments/1kowzjg/professor_messers_practice_exams_precision/
Exam compass A+ practice tests harder than actual exam? : r/CompTIA
https://www.reddit.com/r/CompTIA/comments/12gl595/exam_compass_a_practice_tests_harder_than_actual/
Are Crucial Exams practice tests comparable to the actual exam? : r/CompTIA
https://www.reddit.com/r/CompTIA/comments/1l3xkgj/are_crucial_exams_practice_tests_comparable_to/
1 2
3 16 10 20
21 15 24
6 4 11 12
1 2
3
4 5
6
7 8
9
10
11
12 13
14
15 19
16 17 18 24
20
21
7
CompTIA A+ 1101 Practice Test | CompTIA A+ 220-1101 (V14) Practice Test
https://crucialexams.com/exams/comptia/a/220-1101/practice-tests-practice-questions?
srsltid=AfmBOoq3W3hXf8ORj1sFT4YWTLaQ0c4AfKkZW2sU045QfOSibv50xPF_
Mike Meyers Udemy course for A+ any good? - Reddit
https://www.reddit.com/r/WGUCyberSecurity/comments/16s94oa/mike_meyers_udemy_course_for_a_any_good/
How I Got CompTIA Network+ and Security+ Certified in 8 Days | by Gabriel Drouin | Medium
https://medium.com/@gabrieldrouin/how-i-got-comptia-network-and-security-certified-in-8-days-22950f29a4ab
22
23