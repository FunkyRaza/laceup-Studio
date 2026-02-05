import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Leaf, Heart, Users } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const values = [
  { icon: Award, title: 'Quality First', desc: 'We source only the finest materials and partner with skilled artisans.' },
  { icon: Leaf, title: 'Sustainable', desc: 'Committed to ethical practices and environmental responsibility.' },
  { icon: Heart, title: 'Customer Love', desc: 'Your satisfaction is our priority. Always.' },
  { icon: Users, title: 'Community', desc: 'Building a global community of style-conscious individuals.' },
];

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920)' }}
        >
          <div className="absolute inset-0 bg-foreground/60" />
        </div>
        <div className="container-custom relative z-10 text-center text-primary-foreground">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Story</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Crafting timeless style for the modern individual
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Founded on Passion</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                LACEUP was born from a simple belief: everyone deserves access to premium fashion that doesn't compromise on quality or ethics. Founded in 2020, we set out to create a destination where style meets substance.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Today, we curate collections that blend timeless elegance with contemporary design. Every piece in our catalog is carefully selected to ensure it meets our exacting standards for quality, sustainability, and style.
              </p>
              <Link to="/shop" className="btn-primary rounded-lg inline-flex items-center gap-2">
                Explore Our Collection <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
                alt="Our craftsmanship"
                className="rounded-lg shadow-large"
              />
              <div className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground p-6 rounded-lg">
                <p className="text-3xl font-bold">4+</p>
                <p className="text-sm">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-secondary/30">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div key={i} className="bg-background p-6 rounded-lg text-center card-hover">
                <div className="w-14 h-14 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                  <value.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-bold mb-2">50K+</p>
              <p className="text-muted-foreground">Happy Customers</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold mb-2">200+</p>
              <p className="text-muted-foreground">Products</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold mb-2">15+</p>
              <p className="text-muted-foreground">Countries</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold mb-2">4.9</p>
              <p className="text-muted-foreground">Customer Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Experience LACEUP?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
            Join thousands of satisfied customers who trust us for their style needs.
          </p>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-primary-foreground text-primary px-8 py-4 rounded-lg font-semibold hover:bg-primary-foreground/90 transition-colors">
            Start Shopping <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
