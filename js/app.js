Vue.component('chart', {
    data: function () {
        return {
            cards: [],
            title: "My First Chart!",
            icons: [{ "addr": "img/icons/001-A.svg", "alt": "A", "desc": "" }, { "addr": "img/icons/001-absorb.svg", "alt": "absorb", "desc": "" }, { "addr": "img/icons/001-dad.svg", "alt": "dad", "desc": "" }, { "addr": "img/icons/001-hand wash.svg", "alt": "hand wash", "desc": "" }, { "addr": "img/icons/001-house.svg", "alt": "house", "desc": "" }, { "addr": "img/icons/001-nurse.svg", "alt": "nurse", "desc": "" }, { "addr": "img/icons/001-nursing home.svg", "alt": "nursing home", "desc": "" }, { "addr": "img/icons/001-ribcage.svg", "alt": "ribcage", "desc": "" }, { "addr": "img/icons/001-weight scale.svg", "alt": "weight scale", "desc": "" }, { "addr": "img/icons/002-b.svg", "alt": "b", "desc": "" }, { "addr": "img/icons/002-elderly.svg", "alt": "elderly", "desc": "" }, { "addr": "img/icons/002-eye.svg", "alt": "eye", "desc": "" }, { "addr": "img/icons/002-first aid kit.svg", "alt": "first aid kit", "desc": "" }, { "addr": "img/icons/002-mom.svg", "alt": "mom", "desc": "" }, { "addr": "img/icons/002-parking.svg", "alt": "parking", "desc": "" }, { "addr": "img/icons/002-sanitary pad.svg", "alt": "sanitary pad", "desc": "" }, { "addr": "img/icons/002-sphygmomanometer.svg", "alt": "sphygmomanometer", "desc": "" }, { "addr": "img/icons/002-towel.svg", "alt": "towel", "desc": "" }, { "addr": "img/icons/003-blood.svg", "alt": "blood", "desc": "" }, { "addr": "img/icons/003-c.svg", "alt": "c", "desc": "" }, { "addr": "img/icons/003-elderly.svg", "alt": "elderly", "desc": "" }, { "addr": "img/icons/003-id card.svg", "alt": "id card", "desc": "" }, { "addr": "img/icons/003-menstrual cup.svg", "alt": "menstrual cup", "desc": "" }, { "addr": "img/icons/003-plunger.svg", "alt": "plunger", "desc": "" }, { "addr": "img/icons/003-son.svg", "alt": "son", "desc": "" }, { "addr": "img/icons/003-stethoscope.svg", "alt": "stethoscope", "desc": "" }, { "addr": "img/icons/003-sunglasses.svg", "alt": "sunglasses", "desc": "" }, { "addr": "img/icons/004-d.svg", "alt": "d", "desc": "" }, { "addr": "img/icons/004-daughter.svg", "alt": "daughter", "desc": "" }, { "addr": "img/icons/004-disabled person.svg", "alt": "disabled person", "desc": "" }, { "addr": "img/icons/004-first aid kit.svg", "alt": "first aid kit", "desc": "" }, { "addr": "img/icons/004-medical record.svg", "alt": "medical record", "desc": "" }, { "addr": "img/icons/004-otometer.svg", "alt": "otometer", "desc": "" }, { "addr": "img/icons/004-panty.svg", "alt": "panty", "desc": "" }, { "addr": "img/icons/004-tongue.svg", "alt": "tongue", "desc": "" }, { "addr": "img/icons/004-trash bin.svg", "alt": "trash bin", "desc": "" }, { "addr": "img/icons/005-baby.svg", "alt": "baby", "desc": "" }, { "addr": "img/icons/005-blind.svg", "alt": "blind", "desc": "" }, { "addr": "img/icons/005-body scale.svg", "alt": "body scale", "desc": "" }, { "addr": "img/icons/005-e.svg", "alt": "e", "desc": "" }, { "addr": "img/icons/005-pulse oximeter.svg", "alt": "pulse oximeter", "desc": "" }, { "addr": "img/icons/005-shower.svg", "alt": "shower", "desc": "" }, { "addr": "img/icons/005-stomach.svg", "alt": "stomach", "desc": "" }, { "addr": "img/icons/005-tampon.svg", "alt": "tampon", "desc": "" }, { "addr": "img/icons/005-tissue paper.svg", "alt": "tissue paper", "desc": "" }, { "addr": "img/icons/006-cleaning gloves.svg", "alt": "cleaning gloves", "desc": "" }, { "addr": "img/icons/006-deaf.svg", "alt": "deaf", "desc": "" }, { "addr": "img/icons/006-f.svg", "alt": "f", "desc": "" }, { "addr": "img/icons/006-grandfather.svg", "alt": "grandfather", "desc": "" }, { "addr": "img/icons/006-menstrual cup.svg", "alt": "menstrual cup", "desc": "" }, { "addr": "img/icons/006-rocking chair.svg", "alt": "rocking chair", "desc": "" }, { "addr": "img/icons/006-skull.svg", "alt": "skull", "desc": "" }, { "addr": "img/icons/006-thermometer.svg", "alt": "thermometer", "desc": "" }, { "addr": "img/icons/006-tongue depressor.svg", "alt": "tongue depressor", "desc": "" }, { "addr": "img/icons/007-calendar.svg", "alt": "calendar", "desc": "" }, { "addr": "img/icons/007-cleaning brush.svg", "alt": "cleaning brush", "desc": "" }, { "addr": "img/icons/007-cotton swab.svg", "alt": "cotton swab", "desc": "" }, { "addr": "img/icons/007-finger.svg", "alt": "finger", "desc": "" }, { "addr": "img/icons/007-g.svg", "alt": "g", "desc": "" }, { "addr": "img/icons/007-gas station.svg", "alt": "gas station", "desc": "" }, { "addr": "img/icons/007-grandmother.svg", "alt": "grandmother", "desc": "" }, { "addr": "img/icons/007-scooter.svg", "alt": "scooter", "desc": "" }, { "addr": "img/icons/007-syringe.svg", "alt": "syringe", "desc": "" }, { "addr": "img/icons/008-ambulance.svg", "alt": "ambulance", "desc": "" }, { "addr": "img/icons/008-brain.svg", "alt": "brain", "desc": "" }, { "addr": "img/icons/008-h.svg", "alt": "h", "desc": "" }, { "addr": "img/icons/008-hearing aid.svg", "alt": "hearing aid", "desc": "" }, { "addr": "img/icons/008-parents.svg", "alt": "parents", "desc": "" }, { "addr": "img/icons/008-smartwatch.svg", "alt": "smartwatch", "desc": "" }, { "addr": "img/icons/008-soap.svg", "alt": "soap", "desc": "" }, { "addr": "img/icons/008-toilet paper.svg", "alt": "toilet paper", "desc": "" }, { "addr": "img/icons/008-urine sample.svg", "alt": "urine sample", "desc": "" }, { "addr": "img/icons/009-blood sample.svg", "alt": "blood sample", "desc": "" }, { "addr": "img/icons/009-handwash.svg", "alt": "handwash", "desc": "" }, { "addr": "img/icons/009-I.svg", "alt": "I", "desc": "" }, { "addr": "img/icons/009-mom.svg", "alt": "mom", "desc": "" }, { "addr": "img/icons/009-mouthwash.svg", "alt": "mouthwash", "desc": "" }, { "addr": "img/icons/009-newspaper.svg", "alt": "newspaper", "desc": "" }, { "addr": "img/icons/009-nose.svg", "alt": "nose", "desc": "" }, { "addr": "img/icons/009-smartphone.svg", "alt": "smartphone", "desc": "" }, { "addr": "img/icons/009-stethoscope.svg", "alt": "stethoscope", "desc": "" }, { "addr": "img/icons/010-glucometer.svg", "alt": "glucometer", "desc": "" }, { "addr": "img/icons/010-hospital bed.svg", "alt": "hospital bed", "desc": "" }, { "addr": "img/icons/010-j.svg", "alt": "j", "desc": "" }, { "addr": "img/icons/010-laundry basket.svg", "alt": "laundry basket", "desc": "" }, { "addr": "img/icons/010-medical app.svg", "alt": "medical app", "desc": "" }, { "addr": "img/icons/010-medicine.svg", "alt": "medicine", "desc": "" }, { "addr": "img/icons/010-testicles.svg", "alt": "testicles", "desc": "" }, { "addr": "img/icons/010-toilet paper.svg", "alt": "toilet paper", "desc": "" }, { "addr": "img/icons/010-twins.svg", "alt": "twins", "desc": "" }, { "addr": "img/icons/011-disabled sign.svg", "alt": "disabled sign", "desc": "" }, { "addr": "img/icons/011-eye test.svg", "alt": "eye test", "desc": "" }, { "addr": "img/icons/011-head.svg", "alt": "head", "desc": "" }, { "addr": "img/icons/011-k.svg", "alt": "k", "desc": "" }, { "addr": "img/icons/011-nurse.svg", "alt": "nurse", "desc": "" }, { "addr": "img/icons/011-retirement home.svg", "alt": "retirement home", "desc": "" }, { "addr": "img/icons/011-secure.svg", "alt": "secure", "desc": "" }, { "addr": "img/icons/011-spray.svg", "alt": "spray", "desc": "" }, { "addr": "img/icons/011-wedding.svg", "alt": "wedding", "desc": "" }, { "addr": "img/icons/012-chess pieces.svg", "alt": "chess pieces", "desc": "" }, { "addr": "img/icons/012-crutch.svg", "alt": "crutch", "desc": "" }, { "addr": "img/icons/012-dumb.svg", "alt": "dumb", "desc": "" }, { "addr": "img/icons/012-family.svg", "alt": "family", "desc": "" }, { "addr": "img/icons/012-heart.svg", "alt": "heart", "desc": "" }, { "addr": "img/icons/012-l.svg", "alt": "l", "desc": "" }, { "addr": "img/icons/012-razor.svg", "alt": "razor", "desc": "" }, { "addr": "img/icons/012-reflex hammer.svg", "alt": "reflex hammer", "desc": "" }, { "addr": "img/icons/012-teeth.svg", "alt": "teeth", "desc": "" }, { "addr": "img/icons/013-blind.svg", "alt": "blind", "desc": "" }, { "addr": "img/icons/013-dead.svg", "alt": "dead", "desc": "" }, { "addr": "img/icons/013-emergency button.svg", "alt": "emergency button", "desc": "" }, { "addr": "img/icons/013-hearing test.svg", "alt": "hearing test", "desc": "" }, { "addr": "img/icons/013-large intestine.svg", "alt": "large intestine", "desc": "" }, { "addr": "img/icons/013-m.svg", "alt": "m", "desc": "" }, { "addr": "img/icons/013-medicine.svg", "alt": "medicine", "desc": "" }, { "addr": "img/icons/013-sanitary pad.svg", "alt": "sanitary pad", "desc": "" }, { "addr": "img/icons/013-shampoo.svg", "alt": "shampoo", "desc": "" }, { "addr": "img/icons/014-hand.svg", "alt": "hand", "desc": "" }, { "addr": "img/icons/014-leg.svg", "alt": "leg", "desc": "" }, { "addr": "img/icons/014-n.svg", "alt": "n", "desc": "" }, { "addr": "img/icons/014-pills.svg", "alt": "pills", "desc": "" }, { "addr": "img/icons/014-pregnancy.svg", "alt": "pregnancy", "desc": "" }, { "addr": "img/icons/014-retinal.svg", "alt": "retinal", "desc": "" }, { "addr": "img/icons/014-tablet.svg", "alt": "tablet", "desc": "" }, { "addr": "img/icons/014-Walking aid.svg", "alt": "Walking aid", "desc": "" }, { "addr": "img/icons/014-wheelchair.svg", "alt": "wheelchair", "desc": "" }, { "addr": "img/icons/015-bed.svg", "alt": "bed", "desc": "" }, { "addr": "img/icons/015-birthday.svg", "alt": "birthday", "desc": "" }, { "addr": "img/icons/015-foot.svg", "alt": "foot", "desc": "" }, { "addr": "img/icons/015-injured.svg", "alt": "injured", "desc": "" }, { "addr": "img/icons/015-o.svg", "alt": "o", "desc": "" }, { "addr": "img/icons/015-sweep.svg", "alt": "sweep", "desc": "" }, { "addr": "img/icons/015-thermometer.svg", "alt": "thermometer", "desc": "" }, { "addr": "img/icons/015-tooth.svg", "alt": "tooth", "desc": "" }, { "addr": "img/icons/015-wet wipes.svg", "alt": "wet wipes", "desc": "" }, { "addr": "img/icons/016-blood transfusion.svg", "alt": "blood transfusion", "desc": "" }, { "addr": "img/icons/016-bookshelf.svg", "alt": "bookshelf", "desc": "" }, { "addr": "img/icons/016-breast.svg", "alt": "breast", "desc": "" }, { "addr": "img/icons/016-crippled.svg", "alt": "crippled", "desc": "" }, { "addr": "img/icons/016-moisturizing.svg", "alt": "moisturizing", "desc": "" }, { "addr": "img/icons/016-p.svg", "alt": "p", "desc": "" }, { "addr": "img/icons/016-uncle.svg", "alt": "uncle", "desc": "" }, { "addr": "img/icons/016-urinal.svg", "alt": "urinal", "desc": "" }, { "addr": "img/icons/016-x rays.svg", "alt": "x rays", "desc": "" }, { "addr": "img/icons/017-aunt.svg", "alt": "aunt", "desc": "" }, { "addr": "img/icons/017-disabled person.svg", "alt": "disabled person", "desc": "" }, { "addr": "img/icons/017-ear.svg", "alt": "ear", "desc": "" }, { "addr": "img/icons/017-fireplace.svg", "alt": "fireplace", "desc": "" }, { "addr": "img/icons/017-moisturizer.svg", "alt": "moisturizer", "desc": "" }, { "addr": "img/icons/017-q.svg", "alt": "q", "desc": "" }, { "addr": "img/icons/017-razor.svg", "alt": "razor", "desc": "" }, { "addr": "img/icons/017-ultrasound.svg", "alt": "ultrasound", "desc": "" }, { "addr": "img/icons/018-cat scan.svg", "alt": "cat scan", "desc": "" }, { "addr": "img/icons/018-cotton bud.svg", "alt": "cotton bud", "desc": "" }, { "addr": "img/icons/018-Cotton.svg", "alt": "Cotton", "desc": "" }, { "addr": "img/icons/018-disabled person.svg", "alt": "disabled person", "desc": "" }, { "addr": "img/icons/018-elderly.svg", "alt": "elderly", "desc": "" }, { "addr": "img/icons/018-fingerprint.svg", "alt": "fingerprint", "desc": "" }, { "addr": "img/icons/018-heart rate.svg", "alt": "heart rate", "desc": "" }, { "addr": "img/icons/018-r.svg", "alt": "r", "desc": "" }, { "addr": "img/icons/018-reading book.svg", "alt": "reading book", "desc": "" }, { "addr": "img/icons/019-buttocks.svg", "alt": "buttocks", "desc": "" }, { "addr": "img/icons/019-dust pan.svg", "alt": "dust pan", "desc": "" }, { "addr": "img/icons/019-grandmother.svg", "alt": "grandmother", "desc": "" }, { "addr": "img/icons/019-groceries.svg", "alt": "groceries", "desc": "" }, { "addr": "img/icons/019-injured.svg", "alt": "injured", "desc": "" }, { "addr": "img/icons/019-mri.svg", "alt": "mri", "desc": "" }, { "addr": "img/icons/019-s.svg", "alt": "s", "desc": "" }, { "addr": "img/icons/019-scissors.svg", "alt": "scissors", "desc": "" }, { "addr": "img/icons/019-tissues.svg", "alt": "tissues", "desc": "" }, { "addr": "img/icons/020-back.svg", "alt": "back", "desc": "" }, { "addr": "img/icons/020-band aid.svg", "alt": "band aid", "desc": "" }, { "addr": "img/icons/020-dinner.svg", "alt": "dinner", "desc": "" }, { "addr": "img/icons/020-EKG.svg", "alt": "EKG", "desc": "" }, { "addr": "img/icons/020-grandmother.svg", "alt": "grandmother", "desc": "" }, { "addr": "img/icons/020-sanitary towel.svg", "alt": "sanitary towel", "desc": "" }, { "addr": "img/icons/020-t.svg", "alt": "t", "desc": "" }, { "addr": "img/icons/020-vagina.svg", "alt": "vagina", "desc": "" }, { "addr": "img/icons/020-walking stick.svg", "alt": "walking stick", "desc": "" }, { "addr": "img/icons/021-abdominals.svg", "alt": "abdominals", "desc": "" }, { "addr": "img/icons/021-cream.svg", "alt": "cream", "desc": "" }, { "addr": "img/icons/021-eeg.svg", "alt": "eeg", "desc": "" }, { "addr": "img/icons/021-graduation.svg", "alt": "graduation", "desc": "" }, { "addr": "img/icons/021-hospital bed.svg", "alt": "hospital bed", "desc": "" }, { "addr": "img/icons/021-medical mask.svg", "alt": "medical mask", "desc": "" }, { "addr": "img/icons/021-nurse.svg", "alt": "nurse", "desc": "" }, { "addr": "img/icons/021-pills.svg", "alt": "pills", "desc": "" }, { "addr": "img/icons/021-u.svg", "alt": "u", "desc": "" }, { "addr": "img/icons/022-eye drop.svg", "alt": "eye drop", "desc": "" }, { "addr": "img/icons/022-gift.svg", "alt": "gift", "desc": "" }, { "addr": "img/icons/022-kidneys.svg", "alt": "kidneys", "desc": "" }, { "addr": "img/icons/022-love.svg", "alt": "love", "desc": "" }, { "addr": "img/icons/022-microscope.svg", "alt": "microscope", "desc": "" }, { "addr": "img/icons/022-nurse.svg", "alt": "nurse", "desc": "" }, { "addr": "img/icons/022-sink.svg", "alt": "sink", "desc": "" }, { "addr": "img/icons/022-v.svg", "alt": "v", "desc": "" }, { "addr": "img/icons/022-wheelchair.svg", "alt": "wheelchair", "desc": "" }, { "addr": "img/icons/023-bicep.svg", "alt": "bicep", "desc": "" }, { "addr": "img/icons/023-birthday cake.svg", "alt": "birthday cake", "desc": "" }, { "addr": "img/icons/023-blood test.svg", "alt": "blood test", "desc": "" }, { "addr": "img/icons/023-cleanser.svg", "alt": "cleanser", "desc": "" }, { "addr": "img/icons/023-deodorant.svg", "alt": "deodorant", "desc": "" }, { "addr": "img/icons/023-family tree.svg", "alt": "family tree", "desc": "" }, { "addr": "img/icons/023-hospital.svg", "alt": "hospital", "desc": "" }, { "addr": "img/icons/023-medical assistance.svg", "alt": "medical assistance", "desc": "" }, { "addr": "img/icons/023-w.svg", "alt": "w", "desc": "" }, { "addr": "img/icons/024-dustbin.svg", "alt": "dustbin", "desc": "" }, { "addr": "img/icons/024-height.svg", "alt": "height", "desc": "" }, { "addr": "img/icons/024-multivitamin.svg", "alt": "multivitamin", "desc": "" }, { "addr": "img/icons/024-photo.svg", "alt": "photo", "desc": "" }, { "addr": "img/icons/024-prosthetic.svg", "alt": "prosthetic", "desc": "" }, { "addr": "img/icons/024-reception.svg", "alt": "reception", "desc": "" }, { "addr": "img/icons/024-sponge.svg", "alt": "sponge", "desc": "" }, { "addr": "img/icons/024-uterus.svg", "alt": "uterus", "desc": "" }, { "addr": "img/icons/024-x.svg", "alt": "x", "desc": "" }, { "addr": "img/icons/025-bladder.svg", "alt": "bladder", "desc": "" }, { "addr": "img/icons/025-breakfast.svg", "alt": "breakfast", "desc": "" }, { "addr": "img/icons/025-bucket.svg", "alt": "bucket", "desc": "" }, { "addr": "img/icons/025-crutch.svg", "alt": "crutch", "desc": "" }, { "addr": "img/icons/025-Dental care.svg", "alt": "Dental care", "desc": "" }, { "addr": "img/icons/025-hot water bottle.svg", "alt": "hot water bottle", "desc": "" }, { "addr": "img/icons/025-insurance.svg", "alt": "insurance", "desc": "" }, { "addr": "img/icons/025-thermometer gun.svg", "alt": "thermometer gun", "desc": "" }, { "addr": "img/icons/025-y.svg", "alt": "y", "desc": "" }, { "addr": "img/icons/026-deodorant.svg", "alt": "deodorant", "desc": "" }, { "addr": "img/icons/026-home.svg", "alt": "home", "desc": "" }, { "addr": "img/icons/026-medical report.svg", "alt": "medical report", "desc": "" }, { "addr": "img/icons/026-nurse.svg", "alt": "nurse", "desc": "" }, { "addr": "img/icons/026-oxygen.svg", "alt": "oxygen", "desc": "" }, { "addr": "img/icons/026-pancreas.svg", "alt": "pancreas", "desc": "" }, { "addr": "img/icons/026-walking stick.svg", "alt": "walking stick", "desc": "" }, { "addr": "img/icons/026-wc.svg", "alt": "wc", "desc": "" }, { "addr": "img/icons/026-z.svg", "alt": "z", "desc": "" }, { "addr": "img/icons/027-0.svg", "alt": "0", "desc": "" }, { "addr": "img/icons/027-be free.svg", "alt": "be free", "desc": "" }, { "addr": "img/icons/027-crutches.svg", "alt": "crutches", "desc": "" }, { "addr": "img/icons/027-instalment.svg", "alt": "instalment", "desc": "" }, { "addr": "img/icons/027-medical handbook.svg", "alt": "medical handbook", "desc": "" }, { "addr": "img/icons/027-nurse.svg", "alt": "nurse", "desc": "" }, { "addr": "img/icons/027-perfume.svg", "alt": "perfume", "desc": "" }, { "addr": "img/icons/027-sperm.svg", "alt": "sperm", "desc": "" }, { "addr": "img/icons/027-Walking aid.svg", "alt": "Walking aid", "desc": "" }, { "addr": "img/icons/028-1.svg", "alt": "1", "desc": "" }, { "addr": "img/icons/028-appointment.svg", "alt": "appointment", "desc": "" }, { "addr": "img/icons/028-penis.svg", "alt": "penis", "desc": "" }, { "addr": "img/icons/028-prosthetic.svg", "alt": "prosthetic", "desc": "" }, { "addr": "img/icons/028-retirement.svg", "alt": "retirement", "desc": "" }, { "addr": "img/icons/028-stair.svg", "alt": "stair", "desc": "" }, { "addr": "img/icons/028-tshirt.svg", "alt": "tshirt", "desc": "" }, { "addr": "img/icons/028-washing hands.svg", "alt": "washing hands", "desc": "" }, { "addr": "img/icons/028-wheelchair.svg", "alt": "wheelchair", "desc": "" }, { "addr": "img/icons/029-2.svg", "alt": "2", "desc": "" }, { "addr": "img/icons/029-car.svg", "alt": "car", "desc": "" }, { "addr": "img/icons/029-comb.svg", "alt": "comb", "desc": "" }, { "addr": "img/icons/029-father and son.svg", "alt": "father and son", "desc": "" }, { "addr": "img/icons/029-knitting.svg", "alt": "knitting", "desc": "" }, { "addr": "img/icons/029-sanitary pad.svg", "alt": "sanitary pad", "desc": "" }, { "addr": "img/icons/029-spleen.svg", "alt": "spleen", "desc": "" }, { "addr": "img/icons/029-waiting room.svg", "alt": "waiting room", "desc": "" }, { "addr": "img/icons/029-walking stick.svg", "alt": "walking stick", "desc": "" }, { "addr": "img/icons/030-3.svg", "alt": "3", "desc": "" }, { "addr": "img/icons/030-dna.svg", "alt": "dna", "desc": "" }, { "addr": "img/icons/030-electrocardiogram.svg", "alt": "electrocardiogram", "desc": "" }, { "addr": "img/icons/030-grandmother.svg", "alt": "grandmother", "desc": "" }, { "addr": "img/icons/030-gynecology.svg", "alt": "gynecology", "desc": "" }, { "addr": "img/icons/030-medical prescription.svg", "alt": "medical prescription", "desc": "" }, { "addr": "img/icons/030-neuron.svg", "alt": "neuron", "desc": "" }, { "addr": "img/icons/030-toothbrush.svg", "alt": "toothbrush", "desc": "" }, { "addr": "img/icons/030-wheelchair.svg", "alt": "wheelchair", "desc": "" }, { "addr": "img/icons/031-4.svg", "alt": "4", "desc": "" }, { "addr": "img/icons/031-elevator.svg", "alt": "elevator", "desc": "" }, { "addr": "img/icons/031-family.svg", "alt": "family", "desc": "" }, { "addr": "img/icons/031-medical history.svg", "alt": "medical history", "desc": "" }, { "addr": "img/icons/031-old man.svg", "alt": "old man", "desc": "" }, { "addr": "img/icons/031-skin.svg", "alt": "skin", "desc": "" }, { "addr": "img/icons/031-underwear.svg", "alt": "underwear", "desc": "" }, { "addr": "img/icons/031-wheelchair.svg", "alt": "wheelchair", "desc": "" }, { "addr": "img/icons/032-5.svg", "alt": "5", "desc": "" }, { "addr": "img/icons/032-braille.svg", "alt": "braille", "desc": "" }, { "addr": "img/icons/032-electric shaver.svg", "alt": "electric shaver", "desc": "" }, { "addr": "img/icons/032-Engaged.svg", "alt": "Engaged", "desc": "" }, { "addr": "img/icons/032-old woman.svg", "alt": "old woman", "desc": "" }, { "addr": "img/icons/032-patient.svg", "alt": "patient", "desc": "" }, { "addr": "img/icons/032-pelvis.svg", "alt": "pelvis", "desc": "" }, { "addr": "img/icons/032-slippers.svg", "alt": "slippers", "desc": "" }, { "addr": "img/icons/033-6.svg", "alt": "6", "desc": "" }, { "addr": "img/icons/033-infused water.svg", "alt": "infused water", "desc": "" }, { "addr": "img/icons/033-patient.svg", "alt": "patient", "desc": "" }, { "addr": "img/icons/033-talking.svg", "alt": "talking", "desc": "" }, { "addr": "img/icons/033-teeth.svg", "alt": "teeth", "desc": "" }, { "addr": "img/icons/033-vacuum cleaner.svg", "alt": "vacuum cleaner", "desc": "" }, { "addr": "img/icons/033-wheelchair.svg", "alt": "wheelchair", "desc": "" }, { "addr": "img/icons/033-will.svg", "alt": "will", "desc": "" }, { "addr": "img/icons/034-7.svg", "alt": "7", "desc": "" }, { "addr": "img/icons/034-audio book.svg", "alt": "audio book", "desc": "" }, { "addr": "img/icons/034-certification.svg", "alt": "certification", "desc": "" }, { "addr": "img/icons/034-child.svg", "alt": "child", "desc": "" }, { "addr": "img/icons/034-couple.svg", "alt": "couple", "desc": "" }, { "addr": "img/icons/034-crossword.svg", "alt": "crossword", "desc": "" }, { "addr": "img/icons/034-hand dryer.svg", "alt": "hand dryer", "desc": "" }, { "addr": "img/icons/034-thyroid.svg", "alt": "thyroid", "desc": "" }, { "addr": "img/icons/035-8.svg", "alt": "8", "desc": "" }, { "addr": "img/icons/035-bar soap.svg", "alt": "bar soap", "desc": "" }, { "addr": "img/icons/035-cousin.svg", "alt": "cousin", "desc": "" }, { "addr": "img/icons/035-gown.svg", "alt": "gown", "desc": "" }, { "addr": "img/icons/035-neck.svg", "alt": "neck", "desc": "" }, { "addr": "img/icons/035-prosthetic.svg", "alt": "prosthetic", "desc": "" }, { "addr": "img/icons/035-tennis.svg", "alt": "tennis", "desc": "" }, { "addr": "img/icons/035-x ray.svg", "alt": "x ray", "desc": "" }, { "addr": "img/icons/036-9.svg", "alt": "9", "desc": "" }, { "addr": "img/icons/036-baby feeder.svg", "alt": "baby feeder", "desc": "" }, { "addr": "img/icons/036-gallbladder.svg", "alt": "gallbladder", "desc": "" }, { "addr": "img/icons/036-medical prescription.svg", "alt": "medical prescription", "desc": "" }, { "addr": "img/icons/036-Nail clipper.svg", "alt": "Nail clipper", "desc": "" }, { "addr": "img/icons/036-pet.svg", "alt": "pet", "desc": "" }, { "addr": "img/icons/036-prosthetic.svg", "alt": "prosthetic", "desc": "" }, { "addr": "img/icons/036-sphygmomanometer.svg", "alt": "sphygmomanometer", "desc": "" }, { "addr": "img/icons/037-dish.svg", "alt": "dish", "desc": "" }, { "addr": "img/icons/037-domino.svg", "alt": "domino", "desc": "" }, { "addr": "img/icons/037-fetus.svg", "alt": "fetus", "desc": "" }, { "addr": "img/icons/037-kite.svg", "alt": "kite", "desc": "" }, { "addr": "img/icons/037-Pear Enema.svg", "alt": "Pear Enema", "desc": "" }, { "addr": "img/icons/037-prosthetic.svg", "alt": "prosthetic", "desc": "" }, { "addr": "img/icons/037-vaccination.svg", "alt": "vaccination", "desc": "" }, { "addr": "img/icons/038-crying.svg", "alt": "crying", "desc": "" }, { "addr": "img/icons/038-eye test.svg", "alt": "eye test", "desc": "" }, { "addr": "img/icons/038-habits.svg", "alt": "habits", "desc": "" }, { "addr": "img/icons/038-hand.svg", "alt": "hand", "desc": "" }, { "addr": "img/icons/038-menstrual cup.svg", "alt": "menstrual cup", "desc": "" }, { "addr": "img/icons/038-schedule.svg", "alt": "schedule", "desc": "" }, { "addr": "img/icons/038-sign language.svg", "alt": "sign language", "desc": "" }, { "addr": "img/icons/039-beard.svg", "alt": "beard", "desc": "" }, { "addr": "img/icons/039-camper van.svg", "alt": "camper van", "desc": "" }, { "addr": "img/icons/039-emergency call.svg", "alt": "emergency call", "desc": "" }, { "addr": "img/icons/039-psychology.svg", "alt": "psychology", "desc": "" }, { "addr": "img/icons/039-stairs.svg", "alt": "stairs", "desc": "" }, { "addr": "img/icons/039-syrup.svg", "alt": "syrup", "desc": "" }, { "addr": "img/icons/039-tampon.svg", "alt": "tampon", "desc": "" }, { "addr": "img/icons/040-bill.svg", "alt": "bill", "desc": "" }, { "addr": "img/icons/040-patient.svg", "alt": "patient", "desc": "" }, { "addr": "img/icons/040-prosthetic.svg", "alt": "prosthetic", "desc": "" }, { "addr": "img/icons/040-sock.svg", "alt": "sock", "desc": "" }, { "addr": "img/icons/040-tv.svg", "alt": "tv", "desc": "" }, { "addr": "img/icons/040-veins.svg", "alt": "veins", "desc": "" }, { "addr": "img/icons/040-walker.svg", "alt": "walker", "desc": "" }, { "addr": "img/icons/041-blood pressure gauge.svg", "alt": "blood pressure gauge", "desc": "" }, { "addr": "img/icons/041-bus.svg", "alt": "bus", "desc": "" }, { "addr": "img/icons/041-force.svg", "alt": "force", "desc": "" }, { "addr": "img/icons/041-muscle.svg", "alt": "muscle", "desc": "" }, { "addr": "img/icons/041-quarrel.svg", "alt": "quarrel", "desc": "" }, { "addr": "img/icons/041-television.svg", "alt": "television", "desc": "" }, { "addr": "img/icons/041-tongue.svg", "alt": "tongue", "desc": "" }, { "addr": "img/icons/042-abdominal palpation.svg", "alt": "abdominal palpation", "desc": "" }, { "addr": "img/icons/042-air purifier.svg", "alt": "air purifier", "desc": "" }, { "addr": "img/icons/042-eye test.svg", "alt": "eye test", "desc": "" }, { "addr": "img/icons/042-hearing aid.svg", "alt": "hearing aid", "desc": "" }, { "addr": "img/icons/042-pills.svg", "alt": "pills", "desc": "" }, { "addr": "img/icons/042-throat.svg", "alt": "throat", "desc": "" }, { "addr": "img/icons/042-tv table.svg", "alt": "tv table", "desc": "" }, { "addr": "img/icons/043-checkers.svg", "alt": "checkers", "desc": "" }, { "addr": "img/icons/043-chill.svg", "alt": "chill", "desc": "" }, { "addr": "img/icons/043-eye.svg", "alt": "eye", "desc": "" }, { "addr": "img/icons/043-man.svg", "alt": "man", "desc": "" }, { "addr": "img/icons/043-sperm.svg", "alt": "sperm", "desc": "" }, { "addr": "img/icons/043-ultrasound.svg", "alt": "ultrasound", "desc": "" }, { "addr": "img/icons/043-wheelchair.svg", "alt": "wheelchair", "desc": "" }, { "addr": "img/icons/044-bingo.svg", "alt": "bingo", "desc": "" }, { "addr": "img/icons/044-crutch.svg", "alt": "crutch", "desc": "" }, { "addr": "img/icons/044-diaper.svg", "alt": "diaper", "desc": "" }, { "addr": "img/icons/044-lips.svg", "alt": "lips", "desc": "" }, { "addr": "img/icons/044-mammogram.svg", "alt": "mammogram", "desc": "" }, { "addr": "img/icons/044-siblings.svg", "alt": "siblings", "desc": "" }, { "addr": "img/icons/044-woman.svg", "alt": "woman", "desc": "" }, { "addr": "img/icons/045-baby.svg", "alt": "baby", "desc": "" }, { "addr": "img/icons/045-diaper.svg", "alt": "diaper", "desc": "" }, { "addr": "img/icons/045-guide dog.svg", "alt": "guide dog", "desc": "" }, { "addr": "img/icons/045-man.svg", "alt": "man", "desc": "" }, { "addr": "img/icons/045-mug.svg", "alt": "mug", "desc": "" }, { "addr": "img/icons/045-pap smear.svg", "alt": "pap smear", "desc": "" }, { "addr": "img/icons/045-vagina.svg", "alt": "vagina", "desc": "" }, { "addr": "img/icons/046-baby stroller.svg", "alt": "baby stroller", "desc": "" }, { "addr": "img/icons/046-hospital.svg", "alt": "hospital", "desc": "" }, { "addr": "img/icons/046-inhaler.svg", "alt": "inhaler", "desc": "" }, { "addr": "img/icons/046-lungs.svg", "alt": "lungs", "desc": "" }, { "addr": "img/icons/046-sanitizer.svg", "alt": "sanitizer", "desc": "" }, { "addr": "img/icons/046-sister.svg", "alt": "sister", "desc": "" }, { "addr": "img/icons/046-stretcher.svg", "alt": "stretcher", "desc": "" }, { "addr": "img/icons/047-disabled person.svg", "alt": "disabled person", "desc": "" }, { "addr": "img/icons/047-drops.svg", "alt": "drops", "desc": "" }, { "addr": "img/icons/047-face shield.svg", "alt": "face shield", "desc": "" }, { "addr": "img/icons/047-keys.svg", "alt": "keys", "desc": "" }, { "addr": "img/icons/047-protective mask.svg", "alt": "protective mask", "desc": "" }, { "addr": "img/icons/047-spine.svg", "alt": "spine", "desc": "" }, { "addr": "img/icons/047-walking stick.svg", "alt": "walking stick", "desc": "" }, { "addr": "img/icons/048-bathtub.svg", "alt": "bathtub", "desc": "" }, { "addr": "img/icons/048-breakfast.svg", "alt": "breakfast", "desc": "" }, { "addr": "img/icons/048-disabled person.svg", "alt": "disabled person", "desc": "" }, { "addr": "img/icons/048-joint.svg", "alt": "joint", "desc": "" }, { "addr": "img/icons/048-pills.svg", "alt": "pills", "desc": "" }, { "addr": "img/icons/048-toilet.svg", "alt": "toilet", "desc": "" }, { "addr": "img/icons/048-visor.svg", "alt": "visor", "desc": "" }, { "addr": "img/icons/049-cooking.svg", "alt": "cooking", "desc": "" }, { "addr": "img/icons/049-dental floss.svg", "alt": "dental floss", "desc": "" }, { "addr": "img/icons/049-dna.svg", "alt": "dna", "desc": "" }, { "addr": "img/icons/049-lab.svg", "alt": "lab", "desc": "" }, { "addr": "img/icons/049-mask.svg", "alt": "mask", "desc": "" }, { "addr": "img/icons/049-radio.svg", "alt": "radio", "desc": "" }, { "addr": "img/icons/049-wc.svg", "alt": "wc", "desc": "" }, { "addr": "img/icons/050-antiseptic.svg", "alt": "antiseptic", "desc": "" }, { "addr": "img/icons/050-glove.svg", "alt": "glove", "desc": "" }, { "addr": "img/icons/050-laundry basket.svg", "alt": "laundry basket", "desc": "" }, { "addr": "img/icons/050-lift.svg", "alt": "lift", "desc": "" }, { "addr": "img/icons/050-liver.svg", "alt": "liver", "desc": "" }, { "addr": "img/icons/050-protective gloves.svg", "alt": "protective gloves", "desc": "" }, { "addr": "img/icons/050-sofa.svg", "alt": "sofa", "desc": "" }],
            change: 0
        }
    },
    mounted() {

        if (localStorage.getItem('chartTitle')) {
            this.title = JSON.parse(localStorage.getItem('chartTitle'));
        }

        if (localStorage.getItem('chartSave')) {
            // First check if there is a chart stored in local storage
            this.cards = JSON.parse(localStorage.getItem('chartSave'));
        }
        else {
            // If there is no stored chart, create a new one from scratch
            for (i = 0; i < 20; i++) {
                const img = this.icons[Math.floor(Math.random() * this.icons.length)];
                this.cards.push({
                    id: 'card-' + i,
                    img_addr: img.addr,
                    img_alt: img.alt,
                    heading: '',
                    subtitle: '',
                })
            }
        }
        localStorage.setItem('chartSave', JSON.stringify(this.cards))
        localStorage.setItem('chartTitle', JSON.stringify(this.title))
    },
    watch: {
        'change': function (val) {
            localStorage.setItem('chartSave', JSON.stringify(this.cards))

        },
        'change': function (val) {
            localStorage.setItem('chartTitle', JSON.stringify(this.title))
        }
    },
    methods: {
        increment: function () {
            this.change++;
        },

        printchart: function () {
            print();
        },

        clearchart: function () {
            this.title = "My next chart!";
            this.cards = []
            for (i = 0; i < 20; i++) {
                const img = this.icons[Math.floor(Math.random() * this.icons.length)];
                this.cards.push({
                    id: 'card-' + i,
                    img_addr: img.addr,
                    img_alt: img.alt,
                    heading: '',
                    subtitle: '',
                })
            }
            localStorage.setItem('chartSave', JSON.stringify(this.cards))
            localStorage.setItem('chartTitle', JSON.stringify(this.title))
        },

    },
    template: `
    <section>
    <div class="chart-heading">
    <div class="header-controls text-center d-print-none">
        <b-button v-on:click="printchart" variant="link"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-printer-fill" viewBox="0 0 16 16">
        <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z"/>
        <path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2V7zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
      </svg> Print</b-button>
        <b-button v-on:click="clearchart"  variant="link"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
      </svg> Clear</b-button>
    </div>
    <h1 class="d-print-only text-center">{{title}}</h1>
    <input v-on:change="increment" v-model.lazy="title" maxlength="40" class="text-center d-print-none">
    </div>

    <div class = "row gy-4 row-cols-2 row-cols-sm-4">
    <div v-for="card in this.cards">
    <div class="col" >
    <div class="card">
    <b-button v-b-modal=card.id class="modal-button">
    <img v-bind:src="card.img_addr" class="card-img-top" :alt=card.img_alt>
    </b-button>
    
    <div class="card-body">
    <h5 class="text-center d-print-only">{{ card.heading }}</h5>
    <input v-on:change="increment" v-model.lazy="card.heading" maxlength="12" class="heading-input text-center d-print-none">
    <p class="text-center d-print-only">{{ card.subtitle }}</p>
    <input v-on:change="increment" v-model.lazy="card.subtitle" maxlength="19" class="text-center d-print-none">
    </div>
    
    
    <b-modal :cardWatcher="this.cards" :id="card.id" size="lg" title="Select a new icon" centered ok-only scrollable  no-stacking>
    <div class="container">
    <div class="row">
    <div v-for="icon in icons" :key="icon.message" class="col-4 col-sm-2">
    <b-form-radio v-on:change="increment" v-model.lazy="card.img_addr"  name="icons" :value="icon.addr" >
    <img :src="icon.addr" :alt=icon.alt>
    </b-form-radio>
    </div>
    </div>
    </div>
    </b-modal>
    </div>
    </div>
    </div>
    </div>
    </section>
    `
})


var app = new Vue({
    el: '#app',
})
