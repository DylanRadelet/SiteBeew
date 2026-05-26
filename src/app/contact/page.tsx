// src/app/contact/page.tsx
'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Mail, Phone, MapPin, Send, Check, ChevronRight, Globe, ShoppingCart, Zap, TrendingUp, Wrench, MessageSquare } from 'lucide-react'

const budgets = [
  { label: 'Moins de 1 000€', color: '#9999AA' },
  { label: '1 000€ – 3 000€', color: '#0066FF' },
  { label: '3 000€ – 6 000€', color: '#A855F7' },
  { label: '6 000€ – 10 000€', color: '#22C55E' },
  { label: 'Plus de 10 000€', color: '#F97316' },
  { label: 'Je ne sais pas encore', color: '#9999AA' },
]

const services = [
  { label: 'Site vitrine', color: '#0066FF', icon: Globe },
  { label: 'E-commerce', color: '#A855F7', icon: ShoppingCart },
  { label: 'Application web', color: '#22C55E', icon: Zap },
  { label: 'SEO technique', color: '#F97316', icon: TrendingUp },
  { label: 'Maintenance', color: '#06B6D4', icon: Wrench },
  { label: 'Autre', color: '#9999AA', icon: MessageSquare },
]

const steps = [
  { id: 1, label: 'Qui êtes-vous ?' },
  { id: 2, label: 'Votre projet' },
  { id: 3, label: 'Dites-nous tout' },
]

function HeroShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl2')
    if (!gl) return

    const vs = `#version 300 es
      in vec4 a_pos;
      void main() { gl_Position = a_pos; }`

    // Fragment shader avec fade-out en bas via l'alpha Y
    const fs = `#version 300 es
      precision highp float;
      uniform float u_time;
      uniform vec2  u_res;
      uniform vec2  u_mouse;
      out vec4 fragColor;

      vec3 permute(vec3 x){return mod(((x*34.)+1.)*x,289.);}
      float snoise(vec2 v){
        const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);
        vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);
        vec2 i1=(x0.x>x0.y)?vec2(1,0):vec2(0,1);
        vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod(i,289.);
        vec3 p=permute(permute(i.y+vec3(0,i1.y,1))+i.x+vec3(0,i1.x,1));
        vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
        m=m*m;m=m*m;vec3 x=2.*fract(p*C.www)-1.;vec3 h=abs(x)-.5;
        vec3 ox=floor(x+.5);vec3 a0=x-ox;
        m*=1.79284291400159-.85373472095314*(a0*a0+h*h);
        vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;
        return 130.*dot(m,g);
      }
      vec2 domainWarp(vec2 p,float t){
        float n1=snoise(p+vec2(t,t*.5))*.8;float n2=snoise(p*.5+vec2(-t*.4,t*.9))*.8;
        p+=vec2(n1,n2)*.5;float n3=snoise(p*1.2-vec2(t*.5,-t*.3))*.5;
        float n4=snoise(p+vec2(1.23,-2.11))*.5;p+=vec2(n3,n4)*.3;return p;
      }
      vec3 hsv2rgb(vec3 c){
        vec4 K=vec4(1.,2./3.,1./3.,3.);
        vec3 p=abs(fract(c.xxx+K.xyz)*6.-K.www);
        return c.z*mix(K.xxx,clamp(p-K.xxx,0.,1.),c.y);
      }
      void main(){
        // Coordonnées normalisées
        vec2 st=(gl_FragCoord.xy-.5*u_res)/min(u_res.x,u_res.y);

        // Distorsion souris
        vec2 mouse_uv=(u_mouse-.5*u_res)/min(u_res.x,u_res.y);
        float md=length(st-mouse_uv);
        float ds=smoothstep(.4,.0,md)*.18;
        st+=normalize(st-mouse_uv+.0001)*ds;

        float t=u_time*.08;
        float angle=t*.15;
        mat2 rot=mat2(cos(angle),-sin(angle),sin(angle),cos(angle));
        vec2 uv=rot*st;
        uv=domainWarp(uv,t*1.2);
        uv*=3.;

        // Hex grid
        const mat2 hm=mat2(1.,.5,0.,.8660254);
        vec2 q=hm*uv;vec2 iq=floor(q+.5);vec2 fq=q-iq;
        vec2 ab=abs(fq)-vec2(.5,.4330127);
        float d=length(max(ab,0.))+min(max(ab.x,ab.y),0.);

        float glow=pow(smoothstep(.35,.0,abs(d)),2.2);
        float core=smoothstep(.015,.0,abs(d));
        float flicker=snoise(uv*1.8+u_time*2.)*.25+.75;
        core*=flicker;

        float hue=fract(t*.4+snoise(st*.4+t*.06));
        float hue_beew=fract(0.55+hue*0.25);
        vec3 glowColor=hsv2rgb(vec3(hue_beew,.85,1.));
        vec3 coreColor=vec3(.9,.97,1.);

        vec3 color=vec3(.02,.01,.04);
        color+=glowColor*glow*.7;
        color+=coreColor*core*1.5;

        float vig=1.-smoothstep(.6,1.4,length(st));
        color*=vig;
        color=pow(color,vec3(.88));

        // ── FADE OUT EN BAS ──
        // gl_FragCoord.y = 0 en bas, u_res.y en haut
        // On veut transparent quand y est proche de 0 (bas du canvas)
        float yNorm = gl_FragCoord.y / u_res.y; // 0=bas, 1=haut
        float fadeBottom = smoothstep(0.0, 0.35, yNorm); // fondu sur 35% du bas
        float fadeTop    = smoothstep(0.0, 0.08, 1.0-yNorm); // léger fondu haut

        float baseAlpha = clamp(glow*.8+core*1.,0.,1.);
        float alpha = baseAlpha * fadeBottom * fadeTop;

        fragColor=vec4(color, alpha);
      }`

    function mkShader(type: number, src: string): WebGLShader {
      const s = gl!.createShader(type) as WebGLShader
      gl!.shaderSource(s, src)
      gl!.compileShader(s)
      return s
    }

    const prog = gl.createProgram() as WebGLProgram
    gl.attachShader(prog, mkShader(gl.VERTEX_SHADER, vs))
    gl.attachShader(prog, mkShader(gl.FRAGMENT_SHADER, fs))
    gl.linkProgram(prog)
    gl.useProgram(prog)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uRes = gl.getUniformLocation(prog, 'u_res')
    const uMouse = gl.getUniformLocation(prog, 'u_mouse')

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uRes, canvas.width, canvas.height)
    }

    const onMove = (e: MouseEvent) => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: (e.clientX - rect.left) * dpr,
        y: canvas.height - (e.clientY - rect.top) * dpr,
      }
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)

    const render = (ms: number) => {
      gl.uniform1f(uTime, ms * 0.001)
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      rafRef.current = requestAnimationFrame(render)
    }
    rafRef.current = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: 'screen', opacity: 0.85 }}
    />
  )
}

export default function ContactPage() {
  const formRef = useRef(null)
  const inView = useInView(formRef, { once: true })
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0)
  const [sent, setSent] = useState(false)
  const [time, setTime] = useState('')
  const [form, setForm] = useState({
    prenom: '', nom: '', email: '', telephone: '',
    website: '', budget: '', service: '', message: '',
    rgpd: false,
  })

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('fr-BE', {
      timeZone: 'Europe/Brussels', hour: '2-digit', minute: '2-digit', second: '2-digit',
    }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })
  const next = () => { if (step < steps.length - 1) setStep(s => s + 1) }
  const prev = () => { if (step > 0) setStep(s => s - 1) }

  const submit = async () => {
    if (!form.prenom || !form.email || !form.message) return
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) setSent(true)
      else throw new Error()
    } catch {
      alert("Erreur lors de l'envoi. Écrivez directement à dra@beew.agency")
    } finally {
      setLoading(false)
    }
  }

  const progress = ((step + 1) / steps.length) * 100

  return (
    <div className="min-h-screen bg-[#0A0A0A]">

      {/* ── HERO ── */}
      <section className="relative px-8 md:px-14 pt-32 pb-32 overflow-hidden">
        {/* Shader WebGL */}
        <HeroShader />

        {/* Badge */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="relative z-10 inline-flex items-center gap-2 border border-electric-blue/30 bg-electric-blue/10 rounded-full px-4 py-1.5 mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-display uppercase tracking-widest text-electric-blue">Disponible pour de nouveaux projets</span>
        </motion.div>

        {/* Titre + horloge */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="overflow-hidden">
            <motion.h1 initial={{ y: 100 }} animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-bold tracking-tighter leading-none"
              style={{ fontSize: 'clamp(3rem, 10vw, 8rem)', lineHeight: 0.9 }}>
              PRENONS<br />
              <span className="text-electric-blue">CONTACT.</span>
            </motion.h1>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }} className="flex flex-col gap-3 md:text-right">
            <div className="border border-white/10 rounded-sm px-5 py-3 backdrop-blur-sm bg-black/40">
              <p className="text-xs text-[#9999AA] uppercase tracking-widest mb-1">Bastogne, BE — Heure locale</p>
              <p className="font-display font-bold text-2xl tracking-tighter text-white tabular-nums">{time}</p>
            </div>
            <p className="text-sm text-[#9999AA]">Audit gratuit · Devis en 48h</p>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative z-10 flex flex-wrap gap-6 mt-14">
          {[
            { label: 'Temps de réponse', value: '< 24h', color: '#0066FF' },
            { label: 'Projets livrés', value: '12+', color: '#22C55E' },
            { label: 'Satisfaction', value: '100%', color: '#F97316' },
            { label: 'Devis', value: 'Gratuit', color: '#A855F7' },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="font-display font-bold text-xl" style={{ color }}>{value}</span>
              <span className="text-xs text-[#9999AA]">{label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── MAIN ── */}
      <section ref={formRef} className="px-8 md:px-14 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* Colonne gauche */}
        <div className="lg:col-span-4 flex flex-col gap-8">

          <motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.1 }}>
            <p className="text-xs uppercase tracking-widest text-[#333340] mb-6">Contact direct</p>
            <div className="flex flex-col gap-3">
              {[
                { href: 'mailto:dra@beew.agency', icon: Mail, label: 'dra@beew.agency', color: '#0066FF' },
                { href: 'tel:+32472467309', icon: Phone, label: '+32 472 46 73 09', color: '#22C55E' },
                { href: '#', icon: MapPin, label: 'Bastogne, Wallonie BE', color: '#F97316' },
              ].map(({ href, icon: Icon, label, color }) => (
                <a key={label} href={href}
                  className="flex items-center gap-4 p-4 border border-white/5 rounded-sm hover:border-white/15 transition-all group relative overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(135deg, ${color}08, transparent)` }} />
                  <div className="w-9 h-9 rounded-sm border flex items-center justify-center flex-shrink-0 relative z-10"
                    style={{ borderColor: color + '40', backgroundColor: color + '12' }}>
                    <Icon size={14} style={{ color }} />
                  </div>
                  <span className="text-sm text-[#9999AA] group-hover:text-white transition-colors relative z-10">{label}</span>
                  <ArrowUpRight size={12} className="ml-auto opacity-0 group-hover:opacity-40 transition-opacity relative z-10 text-white" />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="border border-white/5 rounded-sm p-6">
            <p className="text-xs uppercase tracking-widest text-[#333340] mb-6">Ce qui se passe après</p>
            <div className="flex flex-col">
              {[
                { s: '01', label: 'On reçoit votre message', delay: '0 min', color: '#0066FF' },
                { s: '02', label: 'On analyse votre projet', delay: '< 24h', color: '#A855F7' },
                { s: '03', label: 'On vous envoie un devis', delay: '48h', color: '#22C55E' },
                { s: '04', label: 'On démarre ensemble', delay: '1-2 sem.', color: '#F97316' },
              ].map(({ s, label, delay, color }, i) => (
                <div key={s} className="flex gap-4 items-start">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-display font-bold flex-shrink-0"
                      style={{ borderColor: color, color, backgroundColor: color + '15' }}>
                      {s}
                    </div>
                    {i < 3 && <div className="w-px h-8 mt-1" style={{ backgroundColor: color + '30' }} />}
                  </div>
                  <div className="pb-6">
                    <p className="text-sm text-white font-medium">{label}</p>
                    <p className="text-xs text-[#9999AA] mt-0.5">{delay}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="relative border border-electric-blue/20 rounded-sm p-6 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at top left, rgba(0,102,255,0.1), transparent 60%)' }} />
            <p className="text-xs uppercase tracking-widest text-electric-blue mb-2 relative z-10">Audit offert</p>
            <p className="text-sm text-[#9999AA] leading-relaxed relative z-10">
              Chaque projet commence par un audit gratuit : on analyse votre situation, vos objectifs et on vous dit franchement ce qui est réalisable.
            </p>
          </motion.div>
        </div>

        {/* Formulaire multi-step */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="lg:col-span-8">

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="success"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="min-h-[500px] flex flex-col items-center justify-center gap-8 text-center border border-white/5 rounded-sm p-12 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at center, rgba(0,102,255,0.06), transparent 70%)' }} />
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  className="w-20 h-20 rounded-full border-2 border-electric-blue flex items-center justify-center relative z-10"
                  style={{ backgroundColor: 'rgba(0,102,255,0.1)' }}>
                  <Check size={32} className="text-electric-blue" />
                </motion.div>
                <div className="relative z-10">
                  <h2 className="font-display font-bold text-4xl tracking-tighter mb-3">Message envoyé !</h2>
                  <p className="text-[#9999AA] max-w-sm">On revient vers vous dans les 24h avec une analyse de votre projet.</p>
                </div>
                <div className="border border-white/10 rounded-sm p-5 w-full max-w-sm relative z-10">
                  <p className="text-xs text-[#9999AA] uppercase tracking-wider mb-3">Votre demande</p>
                  {[
                    { label: 'Nom', value: `${form.prenom} ${form.nom}` },
                    { label: 'Email', value: form.email },
                    { label: 'Service', value: form.service || 'Non précisé' },
                    { label: 'Budget', value: form.budget || 'Non précisé' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm py-1">
                      <span className="text-[#9999AA]">{label}</span>
                      <span className="text-white font-medium truncate max-w-[60%] text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

            ) : (
              <motion.div key="form" className="border border-white/5 rounded-sm overflow-hidden">
                {/* Header steps */}
                <div className="border-b border-white/5 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs uppercase tracking-widest text-[#9999AA]">Étape {step + 1} sur {steps.length}</p>
                    <p className="text-xs text-electric-blue font-display font-bold">{steps[step].label}</p>
                  </div>
                  <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full bg-electric-blue"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} />
                  </div>
                  <div className="flex gap-3 mt-4">
                    {steps.map((s, i) => (
                      <div key={s.id} className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-display font-bold transition-all duration-300"
                          style={{
                            borderColor: i <= step ? '#0066FF' : 'rgba(255,255,255,0.1)',
                            backgroundColor: i < step ? '#0066FF' : i === step ? 'rgba(0,102,255,0.15)' : 'transparent',
                            color: i <= step ? (i < step ? 'white' : '#0066FF') : '#9999AA',
                          }}>
                          {i < step ? <Check size={10} /> : i + 1}
                        </div>
                        <span className="text-xs hidden md:block" style={{ color: i === step ? 'white' : '#9999AA' }}>
                          {s.label}
                        </span>
                        {i < steps.length - 1 && <ChevronRight size={12} className="text-white/10 hidden md:block" />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-8">
                  <AnimatePresence mode="wait">

                    {step === 0 && (
                      <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { name: 'prenom', label: 'Prénom *', type: 'text', placeholder: 'Jean' },
                            { name: 'nom', label: 'Nom *', type: 'text', placeholder: 'Dupont' },
                            { name: 'email', label: 'Email *', type: 'email', placeholder: 'vous@exemple.be' },
                            { name: 'telephone', label: 'Téléphone', type: 'tel', placeholder: '+32 4XX XXX XXX' },
                          ].map(({ name, label, type, placeholder }) => (
                            <div key={name} className="flex flex-col gap-2">
                              <label className="text-xs text-[#9999AA] uppercase tracking-wider">{label}</label>
                              <input type={type} name={name} value={form[name as keyof typeof form] as string} onChange={handle}
                                placeholder={placeholder}
                                className="bg-white/3 border border-white/10 text-white text-sm px-4 py-3 rounded-sm outline-none focus:border-electric-blue transition-all placeholder:text-white/20 hover:border-white/20" />
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {step === 1 && (
                      <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }} className="flex flex-col gap-8">
                        <div>
                          <label className="text-xs text-[#9999AA] uppercase tracking-wider block mb-4">Service souhaité</label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {services.map(s => {
                              const Icon = s.icon
                              return (
                                <button key={s.label} type="button"
                                  onClick={() => setForm(f => ({ ...f, service: s.label }))}
                                  className="flex items-center gap-3 px-4 py-3 border rounded-sm text-sm font-display font-medium transition-all duration-200 text-left"
                                  style={{
                                    borderColor: form.service === s.label ? s.color : 'rgba(255,255,255,0.1)',
                                    backgroundColor: form.service === s.label ? s.color + '15' : 'rgba(255,255,255,0.02)',
                                    color: form.service === s.label ? s.color : '#9999AA',
                                  }}>
                                  <Icon size={14} style={{ color: form.service === s.label ? s.color : '#9999AA', flexShrink: 0 }} />
                                  <span className="truncate">{s.label}</span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-[#9999AA] uppercase tracking-wider block mb-4">Budget estimé</label>
                          <div className="flex flex-wrap gap-2">
                            {budgets.map(b => (
                              <button key={b.label} type="button"
                                onClick={() => setForm(f => ({ ...f, budget: b.label }))}
                                className="px-4 py-2 border rounded-sm text-xs font-display font-bold transition-all duration-200"
                                style={{
                                  borderColor: form.budget === b.label ? b.color : 'rgba(255,255,255,0.1)',
                                  backgroundColor: form.budget === b.label ? b.color + '15' : 'transparent',
                                  color: form.budget === b.label ? b.color : '#9999AA',
                                }}>
                                {b.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs text-[#9999AA] uppercase tracking-wider">Site web actuel (optionnel)</label>
                          <input type="url" name="website" value={form.website} onChange={handle}
                            placeholder="https://votre-site.be"
                            className="bg-white/3 border border-white/10 text-white text-sm px-4 py-3 rounded-sm outline-none focus:border-electric-blue transition-all placeholder:text-white/20 hover:border-white/20" />
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }} className="flex flex-col gap-6">

                        {/* Recap service + budget */}
                        {(form.service || form.budget) && (
                          <div className="flex gap-2 flex-wrap">
                            {form.service && (
                              <span className="text-xs px-3 py-1 rounded-full border border-electric-blue/30 text-electric-blue bg-electric-blue/10 font-display">
                                {form.service}
                              </span>
                            )}
                            {form.budget && (
                              <span className="text-xs px-3 py-1 rounded-full border border-white/10 text-[#9999AA] font-display">
                                {form.budget}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Textarea */}
                        <div className="flex flex-col gap-2">
                          <label className="text-xs text-[#9999AA] uppercase tracking-wider">Décrivez votre projet *</label>
                          <textarea name="message" value={form.message} onChange={handle} rows={7}
                            placeholder="Parlez-nous de votre projet, vos objectifs, votre cible, vos contraintes…"
                            className="bg-white/3 border border-white/10 text-white text-sm px-4 py-3 rounded-sm outline-none focus:border-electric-blue transition-all resize-none placeholder:text-white/20 hover:border-white/20" />
                          <div className="flex justify-between">
                            <p className="text-xs text-[#9999AA]">Plus vous êtes précis, meilleur sera notre retour.</p>
                            <span className={`text-xs transition-colors ${form.message.length > 20 ? 'text-electric-blue' : 'text-[#9999AA]'}`}>
                              {form.message.length} car.
                            </span>
                          </div>
                        </div>

                        {/* RGPD */}
                        <button
                          type="button"
                          onClick={() => setForm(f => ({ ...f, rgpd: !f.rgpd }))}
                          className="flex items-start gap-3 text-left group p-4 border rounded-sm transition-all duration-200"
                          style={{
                            borderColor: form.rgpd ? 'rgba(0,102,255,0.4)' : 'rgba(255,255,255,0.08)',
                            backgroundColor: form.rgpd ? 'rgba(0,102,255,0.06)' : 'transparent',
                          }}
                        >
                          {/* Case à cocher custom */}
                          <div
                            className="w-5 h-5 rounded-sm border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200"
                            style={{
                              borderColor: form.rgpd ? '#0066FF' : 'rgba(255,255,255,0.25)',
                              backgroundColor: form.rgpd ? '#0066FF' : 'transparent',
                            }}
                          >
                            {form.rgpd && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                              >
                                <Check size={11} className="text-white" />
                              </motion.div>
                            )}
                          </div>

                          {/* Texte */}
                          <div>
                            <p className="text-sm text-white/80 group-hover:text-white transition-colors font-medium mb-1">
                              Je confirme vouloir être recontacté
                            </p>
                            <p className="text-xs text-[#9999AA] leading-relaxed">
                              En soumettant ce formulaire, j'accepte que Beew Agency traite mes données pour répondre à ma demande. Aucune donnée ne sera transmise à des tiers.{' '}
                              <a
                                href="/politique-confidentialite"
                                className="text-electric-blue hover:underline"
                                onClick={e => e.stopPropagation()}
                              >
                                Politique de confidentialité →
                              </a>
                            </p>
                          </div>
                        </button>

                        {/* Indicateur si RGPD pas encore coché */}
                        {!form.rgpd && form.message.length > 10 && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-amber-400/80 flex items-center gap-2"
                          >
                            <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
                            Cochez la case ci-dessus pour envoyer votre message.
                          </motion.p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer nav */}
                <div className="border-t border-white/5 p-6 flex items-center justify-between">
                  <button onClick={prev} disabled={step === 0}
                    className="text-sm text-[#9999AA] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-display">
                    ← Retour
                  </button>
                  {step < steps.length - 1 ? (
                    <button onClick={next}
                      className="inline-flex items-center gap-3 bg-electric-blue text-white px-8 py-3.5 font-display font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-blue-dark transition-colors group">
                      Continuer
                      <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ) : (
                    <button onClick={submit}
                      disabled={!form.prenom || !form.email || !form.message || !form.rgpd || loading}
                      className="inline-flex items-center gap-3 bg-electric-blue text-white px-8 py-3.5 font-display font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      {loading ? 'Envoi…' : 'Envoyer le message'}
                      {!loading && <Send size={13} />}
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </div>
  )
}