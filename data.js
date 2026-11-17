/* Question bank built from "English for Future Engineers 1", lessons 1–6.
   Vocab entry: w = headword, d = definition, s = example sentence with ___, f = form that fills the gap, p = part of speech.
   Grammar entry: q = question, o = options (correct answer FIRST, shuffled at display), x = explanation.
   Typed grammar entry: t:"in", q, a = accepted answers (first = model answer), x.
   Append new items at the END of a list so saved progress keeps matching. */

window.THEMES = [
{
  id: "l1", n: 1,
  title: "Think like an engineer",
  sub: "Claims, evidence & opinion · engineering myths",
  gram: "Hedging",
  vocabLabel: "Key terms",
  vocab: [
    { w: "claim", p: "n", d: "a statement that something is true, which still needs to be supported", s: "“AI will replace engineers” is a ___, not a proven fact.", f: "claim" },
    { w: "evidence", p: "n", d: "facts, data or research results that support or challenge a claim", s: "A study by the International Energy Agency counts as ___.", f: "evidence" },
    { w: "opinion", p: "n", d: "a personal view or belief", s: "“I think electric vehicles are the future” expresses a personal ___.", f: "opinion" },
    { w: "hedging", p: "n", d: "using careful wording that makes a statement less direct or less certain", s: "Words like may, might and appears to are tools for ___.", f: "hedging" },
    { w: "misleading", p: "adj", d: "giving a wrong idea, even if part of it is true", s: "“Electric vehicles produce zero pollution” is ___: they have no tailpipe emissions, but battery production still pollutes.", f: "misleading" },
    { w: "myth", p: "n", d: "a widely believed idea that is false", s: "The idea that the Great Wall of China is visible from space is a ___.", f: "myth" },
    { w: "nuance", p: "n", d: "a small but important difference in meaning or detail", s: "Engineering is full of ___: few statements are simply true or false.", f: "nuance" }
  ],
  grammar: [
    { q: "Which expression shows LOW certainty?", o: ["might", "will", "definitely", "is likely to"], x: "Low certainty: may, might, could, is unlikely to." },
    { q: "“Is likely to” expresses…", o: ["moderate certainty", "strong certainty", "low certainty", "impossibility"], x: "Moderate certainty: is likely to, probably, appears to, seems to." },
    { q: "Which word belongs to STRONG certainty?", o: ["certainly", "probably", "seems to", "could"], x: "Strong certainty: will, definitely, certainly, always." },
    { q: "Complete with a hedge: “AI ___ recognise patterns associated with human emotions.”", o: ["appears to", "definitely will", "always", "never"], x: "“AI appears to recognise patterns…” is more accurate than “AI understands emotions”." },
    { q: "Best rewrite of “Nuclear energy is dangerous.” for an engineering report:", o: ["Nuclear energy may pose significant risks if safety systems fail.", "Nuclear energy is always dangerous.", "Nuclear energy will definitely cause accidents.", "Nuclear energy is certainly dangerous."], x: "A hedge (may) plus a condition makes the statement accurate and professional." },
    { q: "Best hedged version of “AI will replace all engineers.”", o: ["AI is likely to change some engineering tasks.", "AI will certainly replace all engineers.", "AI always replaces engineers.", "AI definitely replaces some engineers."], x: "“Is likely to” + “some” softens an absolute prediction." },
    { q: "Most accurate version of “Electric cars never pollute.”", o: ["Electric cars appear to produce fewer emissions, although battery production can still cause pollution.", "Electric cars never pollute at all.", "Electric cars will always be clean.", "Electric cars certainly produce zero pollution."], x: "Avoid absolutes like never/always when the evidence shows exceptions." },
    { q: "Best hedged version of “Renewable energy solves climate change.”", o: ["Renewable energy could play a major role in reducing climate change.", "Renewable energy definitely solves climate change.", "Renewable energy always solves climate change.", "Renewable energy will solve climate change."], x: "“Could play a major role” is a careful, defensible claim." },
    { q: "Why do scientists and engineers hedge?", o: ["Because evidence changes and predictions are uncertain", "Because they don't know anything", "To make their sentences longer", "Because it is required by law"], x: "They hedge because evidence changes, predictions are uncertain, there are exceptions, and claims need support." },
    { q: "“Electric vehicles reduce CO₂ emissions.” is…", o: ["a claim", "evidence", "an opinion"], x: "It states something as true without giving the supporting data: it's a claim." },
    { q: "“A study by the International Energy Agency found…” is…", o: ["evidence", "a claim", "an opinion"], x: "A study with results is evidence." },
    { q: "“I think electric vehicles are the future.” is…", o: ["an opinion", "a claim", "evidence"], x: "“I think…” signals a personal opinion." },
    { q: "“AI will replace engineers.” is…", o: ["a claim", "evidence", "an opinion"], x: "A statement presented as true that still needs support: a claim." },
    { q: "Can a claim be true? And if it is, does that make it evidence?", o: ["Yes, a claim can be true, but that does not make it evidence.", "No, a claim is always false.", "Yes, and a true claim automatically becomes evidence.", "No, only opinions can be true."], x: "A claim can be true. Evidence is what shows whether it is." },
    { q: "Myth quiz: “Humans only use 10% of their brains.”", o: ["False", "Misleading", "True"], x: "False: we use different parts of our brain throughout the day." },
    { q: "Myth quiz: “The Great Wall of China is visible from space.”", o: ["False", "Misleading", "True"], x: "False: it is usually not visible to the naked eye from space." },
    { q: "Myth quiz: “Electric vehicles produce zero pollution.”", o: ["Misleading", "False", "True"], x: "Misleading: no tailpipe emissions, but producing batteries and electricity can still pollute." },
    { q: "Myth quiz: “Artificial Intelligence understands emotions.”", o: ["Misleading", "False", "True"], x: "Misleading: AI can recognise patterns linked to emotions, but it doesn't understand or feel them." },
    { q: "Myth quiz: “Nuclear power plants can explode like nuclear bombs.”", o: ["False", "Misleading", "True"], x: "False: power plants and bombs work in very different ways." },
    { q: "Myth quiz: “Engineers spend most of their careers solving mathematical equations.”", o: ["Misleading", "False", "True"], x: "Misleading: engineers use maths, but they also design, communicate, test and collaborate." }
  ],
  sheet: `
  <h3>Hedging: degrees of certainty</h3>
  <p>Hedging softens a statement so it is less direct or less certain. Engineers hedge because evidence changes, predictions are uncertain, there are exceptions and claims need support.</p>
  <div class="tbl"><table><thead><tr><th>Strong certainty</th><th>Moderate certainty</th><th>Low certainty</th></tr></thead>
  <tbody><tr><td>will</td><td>is likely to</td><td>may</td></tr><tr><td>definitely</td><td>probably</td><td>might</td></tr><tr><td>certainly</td><td>appears to</td><td>could</td></tr><tr><td>always</td><td>seems to</td><td>is unlikely to</td></tr></tbody></table></div>
  <p class="ex"><s>AI understands emotions.</s> → AI <b>appears to</b> recognise patterns associated with human emotions.</p>
  <h3>Claim, evidence or opinion?</h3>
  <ul><li><b>Claim</b>: a statement presented as true (it can be true, but that doesn't make it evidence).</li><li><b>Evidence</b>: data, studies or results that support or challenge a claim.</li><li><b>Opinion</b>: a personal view (“I think…”).</li></ul>`
},
{
  id: "l2", n: 2,
  title: "AI: promise or hype?",
  sub: "MIT News article: neural transparency & AI design",
  gram: "Reporting verbs",
  vocabLabel: "Vocabulary set 2",
  vocab: [
    { w: "companion", p: "n", d: "a person or thing that provides company", s: "Millions of people now create a personalised AI ___ to chat with every day.", f: "companion" },
    { w: "to predict", p: "v", d: "to say what you think will happen", s: "Users often cannot ___ how a chatbot will behave before they use it.", f: "predict" },
    { w: "glimpse", p: "n", d: "a quick or brief look at something", s: "The new tool gives users a ___ inside the AI model before they interact with it.", f: "glimpse" },
    { w: "sycophancy", p: "n", d: "agreeing with a user too much in order to please them", s: "An AI that agrees with everything you say shows signs of ___.", f: "sycophancy" },
    { w: "likely", p: "adj", d: "probably going to happen", s: "The visualisation shows the chatbot's ___ personality and possible risks.", f: "likely" },
    { w: "in advance", p: "phr", d: "before something happens", s: "The goal is to identify problems ___, before users are affected.", f: "in advance" },
    { w: "overestimated", p: "v", d: "thought something was greater than it really was", s: "Users ___ the positive traits: the chatbot wasn't as good as they thought.", f: "overestimated" },
    { w: "underestimated", p: "v", d: "thought something was less than it really was", s: "Participants ___ the harmful traits: the risks were bigger than they thought.", f: "underestimated" },
    { w: "blind spot", p: "n", d: "something you fail to notice or understand", s: "Not noticing the risks of an AI that always agrees with you creates a dangerous ___.", f: "blind spot" },
    { w: "trust", p: "n", d: "belief that someone or something is reliable", s: "Greater transparency increased users' ___ in the AI.", f: "trust" },
    { w: "commonplace", p: "adj", d: "common or happening frequently", s: "Transparency labels for AI could one day become as ___ as nutrition labels.", f: "commonplace" },
    { w: "informed choice", p: "n", d: "a decision based on enough information", s: "Clear labels help people make more ___ about the AI tools they use.", f: "informed choices" }
  ],
  grammar: [
    { q: "The source presents a RESULT. Which verbs fit?", o: ["find, report, demonstrate", "warn, caution", "argue, maintain", "explain, describe, clarify"], x: "Result → find, report, demonstrate." },
    { q: "The source offers an INTERPRETATION. Which verbs fit?", o: ["suggest, indicate, propose", "find, report, demonstrate", "warn, caution", "argue, maintain"], x: "Interpretation → suggest, indicate, propose." },
    { q: "The source EXPLAINS something. Which verbs fit?", o: ["explain, describe, clarify", "warn, caution", "argue, maintain", "suggest, indicate, propose"], x: "Explanation → explain, describe, clarify." },
    { q: "The source presents a POSITION. Which verbs fit?", o: ["argue, maintain", "find, report", "describe, clarify", "warn, caution"], x: "Position → argue, maintain." },
    { q: "The source identifies a RISK or problem. Which verbs fit?", o: ["warn, caution", "argue, maintain", "find, demonstrate", "explain, describe"], x: "Risk/problem → warn, caution." },
    { q: "Source: “The results indicate that the system may improve performance under certain conditions.” Which report is most accurate?", o: ["The researchers suggest that the system may improve performance under certain conditions.", "The researchers proved that the system improves performance.", "The researchers believe the system will improve performance.", "The researchers say the system always improves performance."], x: "Don't misrepresent your source: keep its level of certainty (indicate/may → suggest/may)." },
    { q: "What's the problem with “The article says AI can appear empathetic”?", o: ["It's grammatically fine, but “says” is vague", "It is grammatically incorrect", "“Says” can't be used with “article”", "It is too formal"], x: "Technically nothing is wrong, but “says” is vague. A precise reporting verb shows what the source does." },
    { q: "“The researchers ___ that an AI which constantly validates users could reinforce unhealthy beliefs.” (a risk)", o: ["warn", "demonstrate", "describe", "maintain"], x: "Identifying a risk → warn / caution." },
    { q: "“The study ___ that participants incorrectly predicted 11 out of 15 personality traits.” (a result)", o: ["found", "cautioned", "proposed", "warned"], x: "Presenting a result → found / reported / demonstrated." },
    { q: "“Researchers ___ that transparency alone may not be enough.” (their position)", o: ["argue", "demonstrate", "clarify", "describe"], x: "Presenting a position → argue / maintain." },
    { q: "“The authors ___ how the tool analyses internal patterns linked to empathy and honesty.” (an explanation)", o: ["describe", "warn", "maintain", "find"], x: "Explaining something → explain / describe / clarify." },
    { q: "“These results ___ that users may trust transparent AI more.” (an interpretation)", o: ["suggest", "prove", "warn", "describe"], x: "Interpretation → suggest / indicate / propose. “Prove” would overstate it." },
    { q: "Your verb changes the meaning. Which verb sounds the MOST certain?", o: ["demonstrate", "suggest", "propose", "indicate"], x: "Demonstrate presents a clear result; suggest/propose/indicate are interpretations." }
  ],
  sheet: `
  <h3>From “says” to academic reporting</h3>
  <p>“The article says…” is not wrong, but it's vague. Choose a verb that shows what the source is doing. <b>Your verb changes the meaning.</b></p>
  <div class="tbl"><table><thead><tr><th>If the source…</th><th>You can use…</th></tr></thead><tbody>
  <tr><td>presents a result</td><td>find, report, demonstrate</td></tr>
  <tr><td>offers an interpretation</td><td>suggest, indicate, propose</td></tr>
  <tr><td>explains something</td><td>explain, describe, clarify</td></tr>
  <tr><td>presents a position</td><td>argue, maintain</td></tr>
  <tr><td>identifies a risk/problem</td><td>warn, caution</td></tr></tbody></table></div>
  <h3>Don't misrepresent your source</h3>
  <p class="ex">Source: “The results <b>indicate</b> that the system <b>may</b> improve performance under certain conditions.”<br>✔ The researchers <b>suggest</b> that the system <b>may</b> improve performance under certain conditions.<br>✘ The researchers <s>proved</s> that the system improves performance.</p>`
},
{
  id: "l3", n: 3,
  title: "Trusting science",
  sub: "American Heart Association study: childhood blood pressure",
  gram: "Passive voice",
  vocabLabel: "Vocabulary set 3",
  vocab: [
    { w: "to follow up on", p: "v", d: "to check or collect more information later", s: "Researchers ___ 38,000 children whose blood pressure had been measured at age 7.", f: "followed up on" },
    { w: "analysis", p: "n", d: "a detailed examination of information or data", s: "The ___ also took body mass index into consideration.", f: "analysis" },
    { w: "to account for (sthg)", p: "v", d: "to consider something when explaining results", s: "A good study must ___ factors such as age and body mass index.", f: "account for" },
    { w: "elevated (blood pressure)", p: "adj", d: "higher than normal", s: "Children with ___ blood pressure had a higher risk of early cardiovascular death.", f: "elevated" },
    { w: "siblings", p: "n", d: "brothers and/or sisters", s: "The study compared children with their brothers and sisters, also called ___.", f: "siblings" },
    { w: "association", p: "n", d: "a connection or relationship between two things", s: "Shared family environments could not fully explain the ___ between the two factors.", f: "association" },
    { w: "findings", p: "n", d: "the results of a study or investigation", s: "The lead researcher said the ___ highlight the importance of monitoring blood pressure early.", f: "findings" }
  ],
  grammar: [
    { q: "Passive voice =", o: ["BE + past participle", "HAVE + infinitive", "DO + past participle", "BE + -ing"], x: "PASSIVE = BE + PAST PARTICIPLE." },
    { q: "Why is the passive common in scientific writing?", o: ["The method, process or result matters more than who did the action", "It is shorter than the active voice", "It shows strong certainty", "It hides that a study was done"], x: "Focus on the research, not the researchers." },
    { q: "In the passive, what changes?", o: ["Only the form of BE; the tense stays the same", "The tense always becomes past", "The main verb takes -ing", "Nothing changes"], x: "The tense stays the same. The form of BE changes." },
    { q: "“Engineers test the material.” (present) →", o: ["The material is tested.", "The material was tested.", "The material has been tested.", "The material is testing."], x: "Present: is/are + past participle." },
    { q: "“Engineers tested the material.” (past) →", o: ["The material was tested.", "The material is tested.", "The material has tested.", "The material was testing."], x: "Past: was/were + past participle." },
    { q: "“Engineers have tested the material.” (present perfect) →", o: ["The material has been tested.", "The material has tested.", "The material was been tested.", "The material is tested."], x: "Present perfect: has/have been + past participle." },
    { q: "“Approximately 38,000 participants ___ followed.”", o: ["were", "was", "have", "are been"], x: "Plural subject, past tense → were followed." },
    { q: "Spot the mistake: “The study was publish in JAMA.”", o: ["publish → published", "was → were", "in → on", "There is no mistake"], x: "BE + PAST PARTICIPLE: was published." },
    { t: "in", q: "Rewrite in the passive: “Researchers measured the children's blood pressure at age 7.”", a: ["The children's blood pressure was measured at age 7."], x: "Object becomes subject + was + measured." },
    { t: "in", q: "Rewrite in the passive: “Researchers followed approximately 38,000 participants.”", a: ["Approximately 38,000 participants were followed."], x: "Plural subject → were followed." },
    { t: "in", q: "Rewrite in the passive: “Researchers converted the measurements into percentiles.”", a: ["The measurements were converted into percentiles."], x: "were + converted." },
    { t: "in", q: "Rewrite in the passive: “Researchers adjusted the analysis for several factors.”", a: ["The analysis was adjusted for several factors."], x: "was + adjusted." },
    { t: "in", q: "Rewrite in the passive: “Researchers published the study in JAMA.”", a: ["The study was published in JAMA."], x: "was + published." },
    { q: "“Engineers have analysed the data.” →", o: ["The data has been analysed.", "The data was being analyse.", "The data have analysed.", "The data is analysing."], x: "Present perfect passive: has/have been + past participle." }
  ],
  sheet: `
  <h3>The passive voice in scientific writing</h3>
  <p>Use the passive when the method, process or result is more important than the person doing the action.</p>
  <p class="ex">Active: Researchers measured the children's blood pressure.<br>Passive: The children's blood pressure <b>was measured</b>.</p>
  <div class="tbl"><table><thead><tr><th>Tense</th><th>Active</th><th>Passive</th></tr></thead><tbody>
  <tr><td>Present</td><td>Engineers test the material.</td><td>The material <b>is tested</b>.</td></tr>
  <tr><td>Past</td><td>Engineers tested the material.</td><td>The material <b>was tested</b>.</td></tr>
  <tr><td>Present perfect</td><td>Engineers have tested the material.</td><td>The material <b>has been tested</b>.</td></tr></tbody></table></div>
  <p><b>PASSIVE = BE + PAST PARTICIPLE.</b> The tense stays the same; the form of BE changes.</p>`
},
{
  id: "l4", n: 4,
  title: "Space exploration: Artemis vs. Mars",
  sub: "Mini research challenge · storyboarding",
  gram: "Comparing & contrasting",
  vocabLabel: "Key terms",
  vocab: [
    { w: "storyboard", p: "n", d: "a visual planner that uses a sequence of panels to show how a video will unfold shot by shot", s: "Before filming, our group drew a ___ to plan every scene.", f: "storyboard" },
    { w: "hook", p: "n", d: "the opening that makes the audience want to keep watching", s: "Start your video with a strong ___ to grab attention.", f: "hook" },
    { w: "verdict", p: "n", d: "the conclusion: is the claim supported, exaggerated, misleading or not supported?", s: "After the evidence, give your ___: the claim is misleading.", f: "verdict" },
    { w: "takeaway", p: "n", d: "the key message the audience should remember", s: "The final ___ should be short and memorable.", f: "takeaway" },
    { w: "feasibility", p: "n", d: "how possible or practical something is to do", s: "Before funding a mission, we must consider its engineering ___.", f: "feasibility" },
    { w: "drawback", p: "n", d: "a disadvantage or problem", s: "One ___ of a Mars mission is the long travel time.", f: "drawback" }
  ],
  grammar: [
    { q: "“___ missions aim to advance space exploration.”", o: ["Both", "Whereas", "Although", "Compared"], x: "Showing similarities: Both… / Similarly… / In both cases…" },
    { q: "“The Moon is relatively close, ___ Mars is much farther away.”", o: ["whereas", "both", "similarly", "one advantage"], x: "Showing differences: However / In contrast / Whereas." },
    { q: "“___ with Mars, the Moon is easier to reach.”", o: ["Compared", "Although", "Whereas", "Similarly"], x: "Making comparisons: more/less… than / Compared with…" },
    { q: "“___ Mars offers exciting possibilities, reaching it presents greater challenges.”", o: ["Although", "Both", "Compared", "Similarly"], x: "Balancing arguments: Although… / While… / On the one hand…" },
    { q: "“A major ___ of a Mars mission is the long travel time.”", o: ["challenge", "advantage", "similarity", "comparison"], x: "Expressing disadvantages: One drawback of… / A major challenge is…" },
    { q: "“One ___ of Artemis is the opportunity to test technologies for future missions.”", o: ["advantage", "drawback", "contrast", "whereas"], x: "Expressing advantages: One advantage of…" },
    { q: "Which expression shows a SIMILARITY?", o: ["Similarly…", "In contrast…", "However…", "One drawback of…"], x: "Similarities: Both / Similarly / In both cases." },
    { q: "“On the one hand…” and “While…” are used for…", o: ["balancing arguments", "showing similarities", "expressing advantages", "making comparisons"], x: "Balancing arguments: Although / While / On the one hand." },
    { q: "“In contrast” is used to…", o: ["show differences", "show similarities", "express advantages", "give evidence"], x: "Differences: However / In contrast / Whereas." },
    { t: "in", q: "Complete with the comparative: “Mars is ___ (far) from Earth than the Moon.”", a: ["farther", "further"], x: "far → farther / further." },
    { q: "Debunking video anatomy: what comes right after the HOOK?", o: ["The claim", "The verdict", "The takeaway", "The evidence"], x: "1 Hook → 2 Claim → 3 Context → 4 Evidence → 5 Verdict → 6 Takeaway." },
    { q: "Hook → claim → context → evidence → ___ → takeaway", o: ["verdict", "hook", "storyboard", "context"], x: "Step 5 is the verdict: supported, exaggerated, misleading or not supported?" },
    { q: "In the CONTEXT part of a debunking video, you explain…", o: ["why people believe the claim and where it came from", "what the audience should remember", "which camera shot to use", "your final grade"], x: "Context: Why do people believe it? Where did it come from?" }
  ],
  sheet: `
  <h3>Comparing & contrasting</h3>
  <div class="tbl"><table><thead><tr><th>Purpose</th><th>Useful language</th><th>Example</th></tr></thead><tbody>
  <tr><td>Similarities</td><td>Both… / Similarly… / In both cases…</td><td><b>Both</b> missions aim to advance space exploration.</td></tr>
  <tr><td>Differences</td><td>However… / In contrast… / Whereas…</td><td>The Moon is relatively close, <b>whereas</b> Mars is much farther away.</td></tr>
  <tr><td>Comparisons</td><td>More/less… than / Compared with…</td><td><b>Compared with</b> Mars, the Moon is easier to reach.</td></tr>
  <tr><td>Balancing</td><td>Although… / While… / On the one hand…</td><td><b>Although</b> Mars offers exciting possibilities, reaching it presents greater challenges.</td></tr>
  <tr><td>Advantages</td><td>One advantage of… / …offers greater opportunities for…</td><td><b>One advantage of</b> Artemis is the opportunity to test technologies.</td></tr>
  <tr><td>Disadvantages</td><td>One drawback of… / A major challenge is…</td><td><b>A major challenge</b> of a Mars mission is the long travel time.</td></tr></tbody></table></div>
  <h3>Anatomy of a debunking video</h3>
  <ol><li><b>Hook</b>: what makes us want to keep watching?</li><li><b>Claim</b>: a clear introduction of what you're investigating</li><li><b>Context</b>: why do people believe it? Where did it come from?</li><li><b>Evidence</b>: what does reliable evidence show?</li><li><b>Verdict</b>: supported, exaggerated, misleading or not supported?</li><li><b>Takeaway</b>: what should your audience remember?</li></ol>`
},
{
  id: "l5", n: 5,
  title: "Engineering misinformation",
  sub: "TED-Ed: how false news can spread",
  gram: "Grammar review",
  vocabLabel: "Vocabulary set 4",
  vocab: [
    { w: "circular reporting", p: "n", d: "when sources repeat the same info, making it seem independently confirmed", s: "Five websites repeated the story, but they all copied one blog: a classic case of ___.", f: "circular reporting" },
    { w: "dire", p: "adj", d: "extremely serious or urgent", s: "Misinformation about vaccines can have ___ consequences for public health.", f: "dire" },
    { w: "to debunk", p: "v", d: "to prove a claim false or misleading using evidence", s: "In our video, we ___ a common engineering myth using reliable evidence.", f: "debunk" },
    { w: "to break down (sthg)", p: "v", d: "to explain something in smaller, simpler parts", s: "Let me ___ this complex process into three simple steps.", f: "break down" },
    { w: "bias", p: "n", d: "a preference or opinion that influences someone's judgment", s: "A source paid by a car company may show ___ in favour of its products.", f: "bias" },
    { w: "to cite", p: "v", d: "to mention where information comes from", s: "Always ___ your sources so your audience can check the information.", f: "cite" },
    { w: "to spread", p: "v", d: "to share or distribute something widely", s: "False news can ___ faster than the truth on social media.", f: "spread" },
    { w: "to misinterpret", p: "v", d: "to understand something incorrectly", s: "Journalists sometimes ___ scientific results and exaggerate them.", f: "misinterpret" },
    { w: "to distort", p: "v", d: "to change information so that it becomes misleading", s: "Cutting a quote out of context can ___ its original meaning.", f: "distort" },
    { w: "to trace back", p: "v", d: "to follow something to its original source", s: "We managed to ___ the rumour to a single anonymous account.", f: "trace back" },
    { w: "independent sources", p: "n", d: "sources that obtain or verify information separately", s: "To confirm a story, journalists look for several ___ that check the facts separately.", f: "independent sources" }
  ],
  grammar: [
    { q: "Circular reporting (aka false confirmation) is when…", o: ["information seems to come from several independent sources but traces back to one original source", "several independent sources confirm a fact", "a journalist reports the news in a circle", "a source is cited correctly"], x: "It looks independently confirmed, but it all comes from a single source." },
    { q: "Which situation is circular reporting?", o: ["Three websites share a clip, but all link back to the same anonymous account", "Three labs repeat an experiment separately and get the same result", "A journalist interviews two different experts", "A study is published in a peer-reviewed journal"], x: "Many copies of one source are not independent confirmation." },
    { q: "How is the “telephone” warm-up similar to circular reporting?", o: ["Information is passed along and distorted without checking the original source", "Everyone checks the original sentence", "The message gets more accurate each time", "It shows how independent sources work"], x: "Each person repeats what they heard, so errors spread." },
    { q: "“A lie can travel halfway around the world while the truth is putting on its shoes” means…", o: ["False information spreads faster than corrections", "The truth always wins quickly", "Lies are easy to spot", "People prefer slow news"], x: "Misinformation spreads faster than the facts that correct it." },
    { q: "Headline: “Scientists PROVE AI cars are 100% safer!” Which rewrite is most accurate?", o: ["Researchers suggest that autonomous vehicles may be safer in controlled conditions.", "Scientists prove that AI cars are 100% safer.", "AI cars will completely eliminate road accidents.", "Self-driving cars never make mistakes."], x: "Reporting verb (suggest) + hedge (may) + limit (controlled conditions)." },
    { q: "“Researchers tested 20 self-driving cars.” → passive", o: ["20 self-driving cars were tested.", "20 self-driving cars was tested.", "20 self-driving cars have test.", "20 self-driving cars were testing."], x: "Plural + past → were tested." },
    { q: "Which sentence contains a HEDGE?", o: ["Autonomous vehicles could reduce some accidents.", "Autonomous vehicles eliminate all accidents.", "Self-driving cars never make mistakes.", "The results guarantee safety."], x: "could = low certainty hedge." },
    { q: "Which sentence makes a COMPARISON?", o: ["Compared with human drivers, self-driving cars appear to make fewer errors in controlled conditions.", "The cars were tested over two weeks.", "The study suggests the cars may be safer.", "Researchers report positive results."], x: "Compared with… introduces a comparison." },
    { q: "What's wrong with “Unlike traditional cars, self-driving vehicles never make mistakes”?", o: ["“Never” is too absolute: the evidence doesn't support it", "It uses the passive voice", "It has no verb", "It uses a reporting verb"], x: "Absolute words (never, always, 100%) need very strong evidence." },
    { q: "20 cars tested for two weeks in controlled conditions. Why is “100% safer” misleading?", o: ["The sample is small and the conditions are not real-world", "The study was too long", "20 cars is a huge sample", "Controlled conditions are the same as real roads"], x: "Small sample + controlled conditions = limited evidence." },
    { q: "Which sentence uses a reporting verb AND a hedge?", o: ["The study indicates that autonomous vehicles might perform well in controlled conditions.", "A new study proves autonomous vehicles are safe.", "Autonomous vehicles were tested.", "Self-driving cars are safer than human drivers."], x: "indicates (reporting verb) + might (hedge)." }
  ],
  sheet: `
  <h3>Circular reporting</h3>
  <p><b>Circular reporting</b> (aka false confirmation): a piece of information appears to come from multiple independent sources but actually traces back to a single original source.</p>
  <h3>Grammar review: make claims accurate</h3>
  <p>When you rewrite a sensational claim, use the four tools from lessons 1–4:</p>
  <ul><li><b>Hedge</b>: may, might, could, appears to…</li><li><b>Reporting verb</b>: suggest, indicate, report…</li><li><b>Passive</b>: were tested, was conducted…</li><li><b>Comparison</b>: whereas, compared with, although…</li></ul>
  <p class="ex">✘ Scientists prove AI-powered cars are 100% safer than human drivers.<br>✔ A small study <b>suggests</b> that self-driving cars <b>may</b> perform well in controlled conditions. Twenty vehicles <b>were tested</b> over two weeks; <b>compared with</b> real roads, however, these conditions are limited.</p>`
},
{
  id: "l6", n: 6,
  title: "Deepfakes & AI-generated content",
  sub: "Article: how humans and AI can detect deepfakes",
  gram: "Modals of deduction",
  vocabLabel: "Vocabulary set 5",
  vocab: [
    { w: "deepfake", p: "n", d: "an AI-generated or manipulated video, image or audio recording that appears real", s: "The video of the politician looked real, but it was actually a ___.", f: "deepfake" },
    { w: "to obstruct", p: "v", d: "to block something or make it difficult to see", s: "A hand in front of the face can ___ the view and make detection harder.", f: "obstruct" },
    { w: "to discredit", p: "v", d: "to damage someone's reputation or make them seem untrustworthy", s: "Some people create fake videos to ___ a politician.", f: "discredit" },
    { w: "dataset", p: "n", d: "a collection of information used for research or analysis", s: "The researchers trained their model on a large ___ of real and fake videos.", f: "dataset" },
    { w: "to assess", p: "v", d: "to evaluate or judge something", s: "Participants were asked to ___ whether each video was real or fake.", f: "assess" },
    { w: "to outperform", p: "v", d: "to perform better than someone or something else", s: "On some types of video, the AI model was able to ___ human participants.", f: "outperform" },
    { w: "intervention", p: "n", d: "an action introduced to influence or test an outcome", s: "The researchers introduced a new ___ to test whether people's decisions would change.", f: "intervention" },
    { w: "to merge", p: "v", d: "to combine two or more things", s: "The best detection model may ___ human judgement and machine learning.", f: "merge" }
  ],
  grammar: [
    { q: "MUST + verb expresses…", o: ["strong certainty (95–99%)", "expectation (80–90%)", "possibility (30–70%)", "impossibility (0–5%)"], x: "Must = logical deduction based on evidence." },
    { q: "SHOULD + verb expresses…", o: ["expectation based on normal circumstances (80–90%)", "strong certainty (95–99%)", "possibility (30–70%)", "impossibility (0–5%)"], x: "The report should be ready by now." },
    { q: "MIGHT / MAY / COULD + verb express…", o: ["uncertain possibility (30–70%)", "strong certainty (95–99%)", "expectation (80–90%)", "impossibility (0–5%)"], x: "The competitor might be planning a new product launch." },
    { q: "CAN'T + verb expresses…", o: ["logical impossibility (0–5%)", "possibility (30–70%)", "expectation (80–90%)", "strong certainty (95–99%)"], x: "The results can't be accurate." },
    { q: "“The CEO ___ be pleased: she's smiling broadly.”", o: ["must", "can't", "should have", "might have"], x: "Clear evidence → must." },
    { q: "“The results ___ be accurate: the sample was only three people.”", o: ["can't", "must", "should", "must have"], x: "Logical impossibility → can't." },
    { q: "“The report ___ be ready by now: it was due this morning.”", o: ["should", "can't", "must have", "can't have"], x: "Expectation in normal circumstances → should." },
    { q: "“The video ___ manipulated: the lighting and shadows don't match.”", o: ["must have been", "can't have been", "should be", "must be"], x: "Past deduction with strong evidence → must have been + past participle." },
    { q: "“The video ___ recorded in 2025: the building was demolished in 2020.”", o: ["can't have been", "must have been", "should have been", "may be"], x: "Past impossibility → can't have been." },
    { q: "“They ___ misunderstood the instructions, but we're not sure.”", o: ["may have", "must", "can't", "should"], x: "Past possibility → may/might/could have + past participle." },
    { q: "“The system ___ detected the fake video automatically: that's what it was designed for.”", o: ["should have", "can't have", "must", "might be"], x: "Past expectation → should have + past participle." },
    { q: "Spot the mistake: “The data must have be deleted.”", o: ["be → been", "must → musted", "have → has", "There is no mistake"], x: "Modal + have + PAST PARTICIPLE: must have been deleted." },
    { q: "Structure of a PAST deduction:", o: ["modal + have + past participle", "modal + had + infinitive", "modal + be + -ing only", "modal + past simple"], x: "must/should/might/can't + have + past participle." },
    { q: "Situation A: a video of a famous politician appears online. The audio sounds unnatural and no reliable news organisation has confirmed it. Best deduction?", o: ["The video could be a deepfake.", "The video can't be fake.", "The video must have been confirmed.", "The video should be real."], x: "Some warning signs, no proof → could/might/may." },
    { q: "Situation B: an AI tool labels a video as fake, but the original recording is on an official government website. Best deduction?", o: ["The detection tool must have made a mistake.", "The video must be a deepfake.", "The government can't have published it.", "The tool can't have made a mistake."], x: "The official original is strong evidence → the tool must have made a mistake." },
    { q: "Situation C: a viral video seems to show an engineer announcing a revolutionary invention. Several websites share it, but all link back to the same anonymous account. Best deduction?", o: ["This might be a case of circular reporting.", "The story must be true: many websites share it.", "Several independent sources must have confirmed it.", "The engineer can't exist."], x: "Many links to one anonymous source → possibly circular reporting." },
    { q: "“The AI model incorrectly classified an authentic video as a deepfake.” Logical conclusion:", o: ["The model might have misinterpreted some visual information.", "The model must be perfect.", "The video can't be authentic.", "The model should never make mistakes."], x: "Possibility in the past → might have + past participle." },
    { t: "in", q: "Complete: “They ___ (know) the results yet: the test hadn't been completed.” (impossibility, past)", a: ["can't have known", "cannot have known", "couldn't have known", "could not have known"], x: "can't have + known." },
    { t: "in", q: "Complete: “They ___ (know) about the problem: there were several warnings.” (strong certainty, past)", a: ["must have known"], x: "must have + known." }
  ],
  sheet: `
  <h3>Modals of deduction: present</h3>
  <div class="tbl"><table><thead><tr><th>Certainty</th><th>Structure</th><th>Example</th></tr></thead><tbody>
  <tr><td>Strong (95–99%)</td><td><b>must</b> + be/verb</td><td>The CEO <b>must be</b> pleased: she's smiling broadly.</td></tr>
  <tr><td>Expected (80–90%)</td><td><b>should</b> + be/verb</td><td>The report <b>should be</b> ready by now.</td></tr>
  <tr><td>Possible (30–70%)</td><td><b>might / may / could</b> + be/verb</td><td>Interest rates <b>could rise</b> next quarter.</td></tr>
  <tr><td>Impossible (0–5%)</td><td><b>can't</b> + be/verb</td><td>The results <b>can't be</b> accurate.</td></tr></tbody></table></div>
  <h3>Modals of deduction: past</h3>
  <div class="tbl"><table><thead><tr><th>Certainty</th><th>Structure</th><th>Example</th></tr></thead><tbody>
  <tr><td>Strong (95–99%)</td><td><b>must have</b> + past participle</td><td>The video <b>must have been</b> manipulated: the shadows don't match.</td></tr>
  <tr><td>Expected (80–90%)</td><td><b>should have</b> + past participle</td><td>The system <b>should have detected</b> the fake video.</td></tr>
  <tr><td>Possible (30–70%)</td><td><b>might / may / could have</b> + past participle</td><td>The researchers <b>could have overlooked</b> a detail.</td></tr>
  <tr><td>Impossible (0–5%)</td><td><b>can't have</b> + past participle</td><td>The video <b>can't have been</b> recorded in 2025: the building was demolished in 2020.</td></tr></tbody></table></div>`
}
];
