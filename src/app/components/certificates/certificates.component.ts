import { Component, OnInit, OnDestroy } from '@angular/core';

interface Certificate {
  id: string;
  courseName: string;
  completionDate: Date;
  instructor: string;
  grade: number;
  certificateUrl: string;
  skills: string[];
  level: string;
  duration: string;
  certificateNumber: string;
  validationCode: string;
  credentialUrl: string;
}

@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.css']
})
export class CertificatesComponent implements OnInit, OnDestroy {
  certificates: Certificate[] = [];
  filteredCertificates: Certificate[] = [];
  searchTerm: string = '';
  selectedSkill: string = '';
  allSkills: string[] = [];
  
  currentUser: any = { name: 'Usuário Teste' };
  showCertificateModal: boolean = false;
  selectedCertificate: Certificate | null = null;

  constructor() { }

  ngOnInit(): void {
    this.loadCertificates();
    this.extractSkills();
    this.filteredCertificates = this.certificates;
    // Oculta o cabeçalho/navbar enquanto estiver na rota de certificados
    document.body.classList.add('hide-header');
  }

  private loadCertificates(): void {
    this.certificates = [
      {
        id: '1',
        courseName: 'Fundamentos do Angular',
        completionDate: new Date('2024-01-15'),
        instructor: 'Prof. Maria Silva',
        grade: 95,
        certificateUrl: '#',
        skills: ['Angular', 'TypeScript', 'RxJS', 'Component Architecture'],
        level: 'Avançado',
        duration: '40 horas',
        certificateNumber: 'CERT-ANG-001',
        validationCode: 'VAL-2024-001',
        credentialUrl: 'https://edunext.com/verify/CERT-ANG-001'
      },
      {
        id: '2',
        courseName: 'JavaScript Avançado',
        completionDate: new Date('2023-12-10'),
        instructor: 'Prof. João Santos',
        grade: 88,
        certificateUrl: '#',
        skills: ['JavaScript', 'ES6+', 'Async/Await', 'DOM Manipulation'],
        level: 'Intermediário',
        duration: '30 horas',
        certificateNumber: 'CERT-JS-002',
        validationCode: 'VAL-2023-002',
        credentialUrl: 'https://edunext.com/verify/CERT-JS-002'
      },
      {
        id: '3',
        courseName: 'CSS Grid e Flexbox',
        completionDate: new Date('2023-11-20'),
        instructor: 'Prof. Ana Costa',
        grade: 92,
        certificateUrl: '#',
        skills: ['CSS', 'Grid Layout', 'Flexbox', 'Responsive Design'],
        level: 'Básico',
        duration: '20 horas',
        certificateNumber: 'CERT-CSS-003',
        validationCode: 'VAL-2023-003',
        credentialUrl: 'https://edunext.com/verify/CERT-CSS-003'
      }
    ];
  }

  private extractSkills(): void {
    const skillsSet = new Set<string>();
    this.certificates.forEach(cert => {
      cert.skills.forEach(skill => skillsSet.add(skill));
    });
    this.allSkills = Array.from(skillsSet).sort();
  }

  filterCertificates(): void {
    this.filteredCertificates = this.certificates.filter(cert => {
      const matchesSearch = cert.courseName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           cert.instructor.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesSkill = !this.selectedSkill || cert.skills.includes(this.selectedSkill);
      
      return matchesSearch && matchesSkill;
    });
  }

  downloadCertificate(certificate: Certificate): void {
    console.log('Baixando certificado:', certificate.courseName);
    alert(`Baixando certificado de ${certificate.courseName}`);
  }

  shareCertificate(certificate: Certificate): void {
    if (navigator.share) {
      navigator.share({
        title: `Certificado - ${certificate.courseName}`,
        text: `Concluí o curso ${certificate.courseName} com nota ${certificate.grade}!`,
        url: window.location.href
      });
    } else {
      const text = `Concluí o curso ${certificate.courseName} com nota ${certificate.grade}!`;
      navigator.clipboard.writeText(text);
      alert('Link copiado para a área de transferência!');
    }
  }

  getGradeColor(grade: number): string {
    if (grade >= 90) return '#4CAF50';
    if (grade >= 80) return '#FF9800';
    if (grade >= 70) return '#FFC107';
    return '#F44336';
  }

  getGradeText(grade: number): string {
    if (grade >= 90) return 'Excelente';
    if (grade >= 80) return 'Muito Bom';
    if (grade >= 70) return 'Bom';
    return 'Regular';
  }

  getGradeLabel(grade: number): string {
    return this.getGradeText(grade);
  }

  getLevelColor(level: string): string {
    switch (level.toLowerCase()) {
      case 'básico': return '#007bff';
      case 'intermediário': return '#FF9800';
      case 'avançado': return '#F44336';
      default: return '#9E9E9E';
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('pt-BR');
  }

  openCertificateModal(certificate: Certificate): void {
    this.selectedCertificate = certificate;
    this.showCertificateModal = true;
  }

  closeCertificateModal(): void {
    this.showCertificateModal = false;
    this.selectedCertificate = null;
  }

  verifyCertificate(certificate: Certificate): void {
    window.open(certificate.credentialUrl, '_blank');
  }

  ngOnDestroy(): void {
    // Garante que a classe seja removida ao destruir o componente
    document.body.classList.remove('hide-header');
  }
}
