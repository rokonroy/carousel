import React, { useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";

export default function TwitterStyleCarouselForm() {
  const [carouselType, setCarouselType] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [username, setUsername] = useState("");
  const [nameTitle, setNameTitle] = useState("");
  const [profileSectionAlign, setProfileSectionAlign] = useState('center');
  const [slides, setSlides] = useState([
    { id: 1, text: "", image: null, cta: "", textSize: 28, ctaSize: 48, alignment: "text-left", profileAlign: "self-start" }
  ]);
  const [downloadLinks, setDownloadLinks] = useState([]);
  const slideRefs = useRef([]);

  const addSlide = () => {
    const nextId = slides.length ? Math.max(...slides.map(s => s.id)) + 1 : 1;
    setSlides(prev => [...prev, { id: nextId, text: "", image: null, cta: "", textSize: 28, ctaSize: 48, alignment: "text-left", profileAlign: "self-start" }]);
  };

  const removeSlide = (id) => {
    setSlides(prev => prev.filter(slide => slide.id !== id));
  };

  const handleSlideChange = (index, field, value) => {
    setSlides(prev => prev.map((slide, i) => i === index ? { ...slide, [field]: value } : slide));
  };

  const generateLinks = () => {
    slideRefs.current = [];
    setDownloadLinks([]);
    setTimeout(() => {
      const promises = slides.map((_, i) => {
        const el = slideRefs.current[i];
        return el ? html2canvas(el).then(canvas => canvas.toDataURL('image/jpeg', 1.0)) : Promise.resolve(null);
      });
      Promise.all(promises).then(urls => {
        setDownloadLinks(urls.map((url, i) => ({ id: slides[i].id, url })));
      });
    }, 100);
  };

  const getImagePreview = useCallback(file => file ? URL.createObjectURL(file) : null, []);

  if (!carouselType) {
    return (
      <div className="max-w-xl mx-auto p-10 text-center">
        <h1 className="text-3xl font-bold">What type of carousel do you want to create?</h1>
        <div className="flex justify-center gap-6 mt-6">
          <Button onClick={() => setCarouselType('b2b')}>B2B Carousel</Button>
          <Button onClick={() => setCarouselType('b2c')}>B2C Carousel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">TWITTER STYLE CAROUSEL</h1>
      <Card>
        <CardContent className="space-y-4 p-4">
          <div>
            <Label>Profile Picture</Label>
            <Input type="file" accept="image/*" onChange={e => setProfilePic(e.target.files[0])} />
          </div>
          <div>
            <Label>Name</Label>
            <Input value={nameTitle} onChange={e => setNameTitle(e.target.value)} placeholder="Roy Antony | IG Shoutouts Expert" />
          </div>
          <div>
            <Label>Username</Label>
            <Input value={username} onChange={e => setUsername(e.target.value)} placeholder="@royantonyofficial" />
          </div>
          <div>
            <Label>Profile Section Alignment</Label>
            <select value={profileSectionAlign} onChange={e => setProfileSectionAlign(e.target.value)}>
              <option value="flex-start">Left</option>
              <option value="center">Center</option>
              <option value="flex-end">Right</option>
            </select>
          </div>

          {slides.map((slide, idx) => (
            <div key={slide.id} className="border rounded-lg p-4">
              <Label>Slide {idx + 1} Text</Label>
              <Textarea value={slide.text} onChange={e => handleSlideChange(idx, 'text', e.target.value)} placeholder="Enter slide text" />
              <div className="flex items-center gap-2 mt-2">
                <Label>Text Size</Label>
                <Button onClick={() => handleSlideChange(idx, 'textSize', Math.max(10, slide.textSize - 2))}>-</Button>
                <span>{slide.textSize}px</span>
                <Button onClick={() => handleSlideChange(idx, 'textSize', slide.textSize + 2)}>+</Button>
              </div>

              <Label className="mt-4">Slide {idx + 1} CTA</Label>
              <Input value={slide.cta} onChange={e => handleSlideChange(idx, 'cta', e.target.value)} placeholder="E.g. Swipe 👉" />
              <div className="flex items-center gap-2 mt-2">
                <Label>CTA Size</Label>
                <Button onClick={() => handleSlideChange(idx, 'ctaSize', Math.max(10, slide.ctaSize - 2))}>-</Button>
                <span>{slide.ctaSize}px</span>
                <Button onClick={() => handleSlideChange(idx, 'ctaSize', slide.ctaSize + 2)}>+</Button>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <div>
                  <Label>Text Alignment</Label>
                  <select value={slide.alignment} onChange={e => handleSlideChange(idx, 'alignment', e.target.value)}>
                    <option value="text-left">Left</option>
                    <option value="text-center">Center</option>
                    <option value="text-justify">Justify</option>
                  </select>
                </div>
              </div>

              <Label className="mt-4">Slide {idx + 1} Image</Label>
              <Input type="file" accept="image/*" onChange={e => handleSlideChange(idx, 'image', e.target.files[0])} />

              <Button variant="destructive" className="mt-4" onClick={() => removeSlide(slide.id)}>
                Delete Slide
              </Button>
            </div>
          ))}
          <Button className="w-full mt-4" onClick={addSlide}>+ Add Slide</Button>
          <Button className="w-full mt-6" onClick={generateLinks}>Generate Download Links</Button>
        </CardContent>
      </Card>

      {downloadLinks.length > 0 && (
        <div className="mt-6 space-y-2">
          <h2 className="text-xl font-semibold">Download Your Slides: open the below link in a new tab to download</h2>
          {downloadLinks.map(link => (
            link.url && (
              <a
                key={link.id}
                href={link.url}
                download={`slide-${link.id}.jpeg`}
                className="text-blue-600 underline block"
              >
                Download Slide {link.id}
              </a>
            )
          ))}
        </div>
      )}

      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            ref={el => (slideRefs.current[idx] = el)}
            style={{
              backgroundColor: 'black',
              color: 'white',
              width: 1080,
              height: 1080,
              borderRadius: 20,
              padding: 40,
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: profileSectionAlign,
              justifyContent: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
              {profilePic && <img src={getImagePreview(profilePic)} alt="Profile" style={{ width: 80, height: 80, borderRadius: '50%', marginRight: 20 }} />}
              <div>
                <div style={{ fontSize: 28, fontWeight: 'bold' }}>{nameTitle}</div>
                <div style={{ fontSize: 20, color: '#aaa' }}>{username}</div>
              </div>
            </div>
            <div style={{ fontSize: slide.textSize, textAlign: slide.alignment, marginBottom: 20 }}>{slide.text}</div>
            {slide.image && <img src={getImagePreview(slide.image)} alt="Slide" style={{ maxWidth: '100%', maxHeight: '30%', marginBottom: 20 }} />}
            <div style={{ fontSize: slide.ctaSize, textAlign: slide.alignment, marginTop: '75%' }}>{slide.cta}</div>
          </div>
        ))}
      </div>
    </div>
  );
}